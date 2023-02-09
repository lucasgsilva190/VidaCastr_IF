import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import {} from "date-fns";
import {
  fetchEpisodeById,
  updateEpisode,
  uploadFile,
} from "../../../services/firebase";
import { convertDurationToTimesString } from "../../../utils/convertDurationToTimeString";
import styles from "./edit.module.scss";
import { pageAuthRequired } from "../../../utils/SSR";

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  description: string;
  fileUrl: string;
  fileType: string;
  fileDuration: number;
};

interface EditCastProps {
  episode: Episode;
}

export default function EditCast({ episode }: EditCastProps) {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [title, setTitle] = React.useState<string>(episode.title || "");
  const [participants, setParticipants] = React.useState<string>(
    episode.members || ""
  );

  const [date, setDate] = React.useState<string>(episode?.publishedAt || "");
  const [audio, setAudio] = React.useState<File>();
  const [audioBaseURL, setAudioBaseURL] = React.useState<string>(
    episode.fileUrl || ""
  );
  const [description, setDescription] = React.useState<string>(
    episode.description || ""
  );
  const [coverImage, setCoverImage] = React.useState<File>();
  const [coverBaseURL, setCoverBaseURL] = React.useState<string>(
    episode.thumbnail || ""
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const audioURL = audio ? await uploadFile(audio, "Audios/") : audioBaseURL;
    const coverURL = coverImage
      ? await uploadFile(coverImage, "Thumbnails/")
      : coverBaseURL;

    await updateEpisode(episode.id, {
      title,
      members: participants,
      published_at: date,
      thumbnail: coverURL,
      description,
      file: {
        url: audioURL,
        type: audio ? audio.type : episode.fileType,
        duration: audio
          ? Math.round(audioRef.current.duration)
          : episode.fileDuration,
      },
    });

    alert("Episodio salvo com sucesso");

    router.push("/");
  }

  return (
    <div className={styles.Container}>
      <div className={styles.Content}>
        <div className={styles.TitleForm}>
          <h1>
            Adicionar uma <span>Entrevista/Conversa</span> na Plataforma
          </h1>
        </div>
        <div className={styles.Form}>
          <form onSubmit={handleSubmit}>
            <audio
              ref={audioRef}
              src={audio ? URL.createObjectURL(audio) : ""}
              style={{ display: "none" }}
            />

            <label>
              Título da Entrevista:
              <br />
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                type="text"
              />
            </label>
            <br />
            <label>
              Participantes:
              <br />
              <input
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                required
                type="text"
              />
            </label>
            <br />
            <div className={styles.FormInGroup}>
              <label>
                Data de Publicação:
                <br />
                <input
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  type="datetime-local"
                />
              </label>
              <label>
                Arquivo de Aúdio:
                <br />
                <input
                  onChange={(e) => setAudio(e.target.files[0])}
                  type="file"
                  accept="audio/*"
                />
              </label>
            </div>
            <label>
              Descrição:
              <br />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </label>
            <label className={styles.CoverImage}>
              Imagem de Capa:
              <br />
              <input
                onChange={(e) => setCoverImage(e.target.files[0])}
                type="file"
                accept="image/*"
              />
            </label>
            <div className={styles.BtnToSubmit}>
              <button
                type="button"
                className={styles.cancel}
                onClick={() => router.back()}
              >
                Cancelar
              </button>
              <button type="submit" className={styles.save}>
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = pageAuthRequired(
  async (ctx) => {
    try {
      const { episodeId } = ctx.params;

      const data = await fetchEpisodeById(episodeId as string);

      const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: data.published_at,
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimesString(
          Number(data.file.duration)
        ),
        description: data.description,
        fileUrl: data.file.url,
        fileType: data.file.type,
        fileDuration: data.file.duration,
      };

      return {
        props: {
          episode,
        },
      };
    } catch (error) {
      if (error === "Episódio não encontrado") {
        return {
          notFound: true,
        };
      }
    }
  }
);
