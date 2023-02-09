import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { convertDurationToTimesString } from "../../utils/convertDurationToTimeString";
import styles from "./episode.module.scss";
import Image from "next/image";
import Link from "next/link";
import { usePlayer } from "../../components/contexts/PlayerContext";
import { useAuth } from "../../components/contexts/AuthContext";
import { deleteEpisode, fetchEpisodeById } from "../../services/firebase";
import { pageAuthRequired } from "../../utils/SSR";

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  description: string;
  url: string;
};

type EpisodeProps = {
  episode: Episode;
};

export default function Episode({ episode }: EpisodeProps) {
  const { play } = usePlayer();
  const { isAdmin } = useAuth();
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Você tem certeza que deseja excluir este episódio?")) return;

    await deleteEpisode(episode.id);

    router.push("/");
  };

  const handleEdit = () => router.push(`/episodes/edit/${episode.id}`);

  return (
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          objectFit="cover"
        />
        <button type="button" onClick={() => play(episode)}>
          <img src="/play.svg" alt="Tocar Episódio" />/
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>

        {isAdmin && (
          <div>
            <button onClick={handleDelete} className={styles.deleteButton}>
              Excluir episódio
            </button>
            <button onClick={handleEdit} className={styles.editButton}>
              Editar episódio
            </button>
          </div>
        )}
      </header>

      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = pageAuthRequired(
  async (ctx) => {
    try {
      const { slug } = ctx.params;

      const data = await fetchEpisodeById(slug as string);

      const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), "d MMM yy", {
          locale: ptBR,
        }),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimesString(
          Number(data.file.duration)
        ),
        description: data.description,
        url: data.file.url,
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
