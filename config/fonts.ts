import { Anton, Fira_Code as FontMono, Inter as FontSans, Press_Start_2P, Kode_Mono, Quicksand } from "next/font/google"

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
})

fontSans.className = "font-sans"

export const pressStart2P = fontSans


// Quicksand({
//   subsets: ["latin-ext"],
//   weight: "400",
// })

// export const kodeMono =
// }) //Kode_Mono({ subsets: ['latin'], weight: "400" });//Press_Start_2P({ subsets: ['cyrillic'], weight: "400" }); 

// export const kodeMono = Kode_Mono({ subsets: ['latin'], weight: "400" });