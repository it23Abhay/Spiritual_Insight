'use client'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// We define a basic set of local translations specifically for the Preferences panel
// to demonstrate that the language switch actually works immediately.
const resources = {
  en: {
    translation: {
      // Profile
      Profile: 'Profile',
      TotalMalas: 'Total Malas',
      TotalBeads: 'Total Beads',
      Sessions: 'Sessions',
      JapMalaHistory: 'Jap Mala History',
      FavouriteAudio: 'Favourite Audio',
      Preferences: 'Preferences',
      Language: 'Language',
      Theme: 'Theme',
      SignOut: 'Sign Out',
      Light: 'Light',
      Dark: 'Dark',
      System: 'System',
      // Nav
      Home: 'Home',
      JapMala: 'Jap Mala',
      AIGuide: 'AI Guide',
      KidsZone: 'Kids Zone',
      AudioLibrary: 'Audio Library',
      VideoLibrary: 'Video Library',
      Books: 'Books',
      SignIn: 'Sign In',
      // Home & General
      DailyQuote: 'Daily Spiritual Quote',
      TodaysMantra: 'Today\'s Mantra',
      StartJapMala: 'Start Jap Mala',
      Explore: 'Explore Spiritual Content',
      LearnMore: 'Learn More',
      // Jap Mala Page
      DigitalJapMala: 'Digital Jap Mala',
      TapTheMala: 'Tap the mala to count recitations',
      CurrentBead: 'Current Bead',
      CompletedMalas: 'Completed Malas',
      TotalCount: 'Total Count',
      Reset: 'Reset',
      Start: 'Start',
      Pause: 'Pause'
    }
  },
  hi: {
    translation: {
      Profile: 'प्रोफ़ाइल',
      TotalMalas: 'कुल मालाएँ',
      TotalBeads: 'कुल मनके',
      Sessions: 'सत्र',
      JapMalaHistory: 'जाप माला इतिहास',
      FavouriteAudio: 'पसंदीदा ऑडियो',
      Preferences: 'प्राथमिकताएं',
      Language: 'भाषा',
      Theme: 'थीम',
      SignOut: 'लॉग आउट',
      Light: 'लाइट (हल्का)',
      Dark: 'डार्क (गहरा)',
      System: 'सिस्टम',
      Home: 'होम',
      JapMala: 'जाप माला',
      AIGuide: 'एआई गाइड',
      KidsZone: 'किड्स ज़ोन',
      AudioLibrary: 'ऑडियो लाइब्रेरी',
      VideoLibrary: 'वीडियो लाइब्रेरी',
      Books: 'किताबें',
      SignIn: 'साइन इन करें',
      DailyQuote: 'दैनिक आध्यात्मिक सुविचार',
      TodaysMantra: 'आज का मंत्र',
      StartJapMala: 'जाप माला शुरू करें',
      Explore: 'आध्यात्मिक सामग्री खोजें',
      LearnMore: 'और जानें',
      DigitalJapMala: 'डिजिटल जाप माला',
      TapTheMala: 'गिनती के लिए माला पर टैप करें',
      CurrentBead: 'वर्तमान मनका',
      CompletedMalas: 'पूर्ण माला',
      TotalCount: 'कुल गिनती',
      Reset: 'रीसेट',
      Start: 'शुरू',
      Pause: 'रोकें'
    }
  },
  mr: {
    translation: {
      Profile: 'प्रोफाइल',
      TotalMalas: 'एकूण माळा',
      TotalBeads: 'एकूण मणी',
      Sessions: 'सत्रे',
      JapMalaHistory: 'जप माळा इतिहास',
      FavouriteAudio: 'आवडते ऑडिओ',
      Preferences: 'प्राधान्ये',
      Language: 'भाषा',
      Theme: 'थीम',
      SignOut: 'बाहेर पडा',
      Light: 'प्रकाश',
      Dark: 'गडद',
      System: 'प्रणाली',
      Home: 'मुख्यपृष्ठ',
      JapMala: 'जप माळा',
      AIGuide: 'एआय मार्गदर्शक',
      KidsZone: 'किड्स झोन',
      AudioLibrary: 'ऑडिओ लायब्ररी',
      VideoLibrary: 'व्हिडिओ लायब्ररी',
      Books: 'पुस्तके',
      SignIn: 'साइन इन करा',
      DailyQuote: 'दैनंदिन आध्यात्मिक सुविचार',
      TodaysMantra: 'आजचा मंत्र',
      StartJapMala: 'जप माळा सुरू करा',
      Explore: 'आध्यात्मिक साहित्य एक्सप्लोर करा',
      LearnMore: 'अधिक जाणून घ्या',
      DigitalJapMala: 'डिजिटल जप माळा',
      TapTheMala: 'मोजणीसाठी माळेवर टॅप करा',
      CurrentBead: 'सध्याचा मणी',
      CompletedMalas: 'पूर्ण माळा',
      TotalCount: 'एकूण मोजणी',
      Reset: 'रीसेट वेळ',
      Start: 'सुरू करा',
      Pause: 'थांबवा'
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
