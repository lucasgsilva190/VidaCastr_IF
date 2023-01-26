import { useRouter } from "next/router";
import React, { useRef } from "react";
import { api } from "../../services/api";
import { uploadFile } from "../../services/firebase";
import { convertDurationToTimesString } from "../../utils/convertDurationToTimeString";
import styles from "./styles.module.scss";

export const AddNewCast = () => {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [title, setTitle] = React.useState<string>("");
  const [participants, setParticipants] = React.useState<string>("");
  const [date, setDate] = React.useState<string>("");
  const [audio, setAudio] = React.useState<File>();
  const [description, setDescription] = React.useState<string>("");
  const [coverImage, setCoverImage] = React.useState<File>();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const audioURL = await uploadFile(audio, "Audios/");

    const coverURL = await uploadFile(coverImage, "Thumbnails/");

    await api.post("/episodes", {
      id: title.replace(" ", "-").toLocaleLowerCase(),
      title,
      members: participants,
      published_at: date,
      thumbnail: coverURL,
      description,
      file: {
        url: audioURL,
        type: audio.type,
        duration: Math.round(audioRef.current.duration),
      },
    });

    alert("Episodio salvo com sucesso");

    router.reload();
  }

  function handleReset() {
    setTitle("");
    setParticipants("");
    setDate("");
    setAudio(undefined);
    setDescription("");
    setCoverImage(undefined);
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
          <form onSubmit={handleSubmit} onReset={handleReset}>
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
                  type="date"
                />
              </label>
              <label>
                Arquivo de Aúdio:
                <br />
                <input
                  onChange={(e) => setAudio(e.target.files[0])}
                  required
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
                required
                type="file"
                accept="image/*"
              />
            </label>
            <div className={styles.BtnToSubmit}>
              <button type="reset" className={styles.cancel}>
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
};
