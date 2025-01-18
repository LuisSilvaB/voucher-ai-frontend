import { Montserrat, Gabarito, Inter, Cookie, Poppins, Concert_One } from "next/font/google"; 

export const monserrat = Montserrat({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})

export const gabarito = Gabarito({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const inter = Inter({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})

export const cookie = Cookie({
  weight: ['400'],
  subsets: ['latin'],
})

export const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})

export const concertOne = Concert_One({
  weight: ['400'],
  subsets: ['latin'],
})