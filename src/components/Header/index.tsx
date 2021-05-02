import format from "date-fns/format";
import ptBR from "date-fns/locale/pt-BR";
import Link from "next/link";

import styles from "./styles.module.scss";
import { motion } from 'framer-motion';

export function Header() {
  const currentDate = format(new Date(), "EEEEEE, d MMMM", {
    locale: ptBR,
  });

  return (
    <motion.header
    transition={{ delay: 0.15, duration: 0.5 }}
    className={styles.headerContainer}
     variants={{
       show: { opacity: 1, y: "0" },
       hidden: { opacity: 0, y: "100%" },
     }}
     initial="hidden"
     animate="show"
   >
      <Link href="/">
        <a>
            <img src="/logo.svg" alt="Podcastr" />
        </a>
      </Link>

      <p>O melhor para você ouvir, sempre</p>

      <span>{currentDate}</span>
    </motion.header>
  );
}
