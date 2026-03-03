export interface EmojiItem {
  emoji: string;
  name_en: string;
  name_es: string;
}

export interface EmojiCategory {
  icon: string;
  title: string;
  emojis: EmojiItem[];
}

export const EMOJI_CATEGORIES: Record<string, EmojiCategory> = {
  "smileys": {
    "icon": "😊",
    "title": "Smileys & Emotion",
    "emojis": [
      {
        "emoji": "😀",
        "name_en": "grinning face",
        "name_es": "cara sonriente"
      },
      {
        "emoji": "😁",
        "name_en": "beaming face with smiling eyes",
        "name_es": "cara radiante con ojos sonrientes"
      },
      {
        "emoji": "😂",
        "name_en": "face with tears of joy",
        "name_es": "cara con lágrimas de alegría"
      },
      {
        "emoji": "🤣",
        "name_en": "rolling on the floor laughing",
        "name_es": "rodando en el suelo de la risa"
      },
      {
        "emoji": "😃",
        "name_en": "grinning face with big eyes",
        "name_es": "cara sonriente con ojos grandes"
      },
      {
        "emoji": "😄",
        "name_en": "grinning face with smiling eyes",
        "name_es": "cara sonriente con ojos sonrientes"
      },
      {
        "emoji": "😅",
        "name_en": "grinning face with sweat",
        "name_es": "cara sonriente con sudor"
      },
      {
        "emoji": "😆",
        "name_en": "grinning squinting face",
        "name_es": "cara sonriente con ojos cerrados"
      },
      {
        "emoji": "😉",
        "name_en": "winking face",
        "name_es": "cara guiñando un ojo"
      },
      {
        "emoji": "😊",
        "name_en": "smiling face with smiling eyes",
        "name_es": "cara sonriente con ojos sonrientes"
      },
      {
        "emoji": "😋",
        "name_en": "face savoring food",
        "name_es": "cara saboreando comida"
      },
      {
        "emoji": "😎",
        "name_en": "smiling face with sunglasses",
        "name_es": "cara sonriente con gafas de sol"
      },
      {
        "emoji": "😍",
        "name_en": "smiling face with heart-eyes",
        "name_es": "cara sonriente con ojos de corazón"
      },
      {
        "emoji": "😘",
        "name_en": "face blowing a kiss",
        "name_es": "cara lanzando un beso"
      },
      {
        "emoji": "🥰",
        "name_en": "smiling face with hearts",
        "name_es": "cara sonriente con corazones"
      },
      {
        "emoji": "😗",
        "name_en": "kissing face",
        "name_es": "cara besando"
      },
      {
        "emoji": "😙",
        "name_en": "kissing face with smiling eyes",
        "name_es": "cara besando con ojos sonrientes"
      },
      {
        "emoji": "😚",
        "name_en": "kissing face with closed eyes",
        "name_es": "cara besando con ojos cerrados"
      },
      {
        "emoji": "🙂",
        "name_en": "slightly smiling face",
        "name_es": "cara ligeramente sonriente"
      },
      {
        "emoji": "🤗",
        "name_en": "hugging face",
        "name_es": "cara abrazando"
      },
      {
        "emoji": "🤩",
        "name_en": "star-struck",
        "name_es": "cara deslumbrada"
      },
      {
        "emoji": "🤔",
        "name_en": "thinking face",
        "name_es": "cara pensativa"
      },
      {
        "emoji": "🤨",
        "name_en": "face with raised eyebrow",
        "name_es": "cara con ceja levantada"
      },
      {
        "emoji": "😐",
        "name_en": "neutral face",
        "name_es": "cara neutral"
      },
      {
        "emoji": "😑",
        "name_en": "expressionless face",
        "name_es": "cara sin expresión"
      },
      {
        "emoji": "😶",
        "name_en": "face without mouth",
        "name_es": "cara sin boca"
      },
      {
        "emoji": "🙄",
        "name_en": "face with rolling eyes",
        "name_es": "cara con ojos en blanco"
      },
      {
        "emoji": "😏",
        "name_en": "smirking face",
        "name_es": "cara con sonrisa de suficiencia"
      },
      {
        "emoji": "😣",
        "name_en": "persevering face",
        "name_es": "cara perseverante"
      },
      {
        "emoji": "😥",
        "name_en": "sad but relieved face",
        "name_es": "cara triste pero aliviada"
      },
      {
        "emoji": "😮",
        "name_en": "face with open mouth",
        "name_es": "cara con boca abierta"
      },
      {
        "emoji": "🤐",
        "name_en": "zipper-mouth face",
        "name_es": "cara con cremallera en la boca"
      },
      {
        "emoji": "😯",
        "name_en": "hushed face",
        "name_es": "cara en silencio"
      },
      {
        "emoji": "😪",
        "name_en": "sleepy face",
        "name_es": "cara somnolienta"
      },
      {
        "emoji": "😫",
        "name_en": "tired face",
        "name_es": "cara cansada"
      },
      {
        "emoji": "🥱",
        "name_en": "yawning face",
        "name_es": "cara bostezando"
      },
      {
        "emoji": "😴",
        "name_en": "sleeping face",
        "name_es": "cara dormida"
      },
      {
        "emoji": "😌",
        "name_en": "relieved face",
        "name_es": "cara aliviada"
      },
      {
        "emoji": "😛",
        "name_en": "face with tongue",
        "name_es": "cara con lengua"
      },
      {
        "emoji": "😜",
        "name_en": "winking face with tongue",
        "name_es": "cara guiñando un ojo con lengua"
      },
      {
        "emoji": "😝",
        "name_en": "squinting face with tongue",
        "name_es": "cara con ojos cerrados y lengua"
      },
      {
        "emoji": "😒",
        "name_en": "unamused face",
        "name_es": "cara no divertida"
      },
      {
        "emoji": "😓",
        "name_en": "downcast face with sweat",
        "name_es": "cara triste con sudor"
      },
      {
        "emoji": "😔",
        "name_en": "pensive face",
        "name_es": "cara pensativa"
      },
      {
        "emoji": "😕",
        "name_en": "confused face",
        "name_es": "cara confundida"
      },
      {
        "emoji": "🙃",
        "name_en": "upside-down face",
        "name_es": "cara al revés"
      },
      {
        "emoji": "🤑",
        "name_en": "money-mouth face",
        "name_es": "cara con boca de dinero"
      },
      {
        "emoji": "🤒",
        "name_en": "face with thermometer",
        "name_es": "cara con termómetro"
      },
      {
        "emoji": "🤕",
        "name_en": "face with head-bandage",
        "name_es": "cara con vendaje en la cabeza"
      },
      {
        "emoji": "🤢",
        "name_en": "nauseated face",
        "name_es": "cara con náuseas"
      },
      {
        "emoji": "🤮",
        "name_en": "face vomiting",
        "name_es": "cara vomitando"
      },
      {
        "emoji": "🤧",
        "name_en": "sneezing face",
        "name_es": "cara estornudando"
      },
      {
        "emoji": "🥵",
        "name_en": "hot face",
        "name_es": "cara acalorada"
      },
      {
        "emoji": "🥶",
        "name_en": "cold face",
        "name_es": "cara congelada"
      },
      {
        "emoji": "🥴",
        "name_en": "woozy face",
        "name_es": "cara mareada"
      },
      {
        "emoji": "😵",
        "name_en": "dizzy face",
        "name_es": "cara mareada"
      },
      {
        "emoji": "😷",
        "name_en": "face with medical mask",
        "name_es": "cara con mascarilla médica"
      },
      {
        "emoji": "🤯",
        "name_en": "exploding head",
        "name_es": "cabeza explotando"
      },
      {
        "emoji": "🤠",
        "name_en": "cowboy hat face",
        "name_es": "cara con sombrero de vaquero"
      },
      {
        "emoji": "🥳",
        "name_en": "partying face",
        "name_es": "cara de fiesta"
      }
    ]
  },
  "body": {
    "icon": "🖐️",
    "title": "Body",
    "emojis": [
      {
        "emoji": "👋",
        "name_en": "waving hand",
        "name_es": "mano saludando"
      },
      {
        "emoji": "🤚",
        "name_en": "raised back of hand",
        "name_es": "dorso de mano levantada"
      },
      {
        "emoji": "🖐",
        "name_en": "hand with fingers splayed",
        "name_es": "mano con dedos abiertos"
      },
      {
        "emoji": "✋",
        "name_en": "raised hand",
        "name_es": "mano levantada"
      },
      {
        "emoji": "🖖",
        "name_en": "vulcan salute",
        "name_es": "saludo vulcano"
      },
      {
        "emoji": "👌",
        "name_en": "OK hand",
        "name_es": "mano haciendo OK"
      },
      {
        "emoji": "🤌",
        "name_en": "pinched fingers",
        "name_es": "dedos pellizcando"
      },
      {
        "emoji": "🤏",
        "name_en": "pinching hand",
        "name_es": "mano pellizcando"
      },
      {
        "emoji": "✌",
        "name_en": "victory hand",
        "name_es": "mano de victoria"
      },
      {
        "emoji": "🤞",
        "name_en": "crossed fingers",
        "name_es": "dedos cruzados"
      },
      {
        "emoji": "🤟",
        "name_en": "love-you gesture",
        "name_es": "gesto te amo"
      },
      {
        "emoji": "🤘",
        "name_en": "sign of the horns",
        "name_es": "signo de cuernos"
      },
      {
        "emoji": "🤙",
        "name_en": "call me hand",
        "name_es": "mano de llamada"
      },
      {
        "emoji": "👈",
        "name_en": "backhand index pointing left",
        "name_es": "dedo señalando a la izquierda"
      },
      {
        "emoji": "👉",
        "name_en": "backhand index pointing right",
        "name_es": "dedo señalando a la derecha"
      },
      {
        "emoji": "👆",
        "name_en": "backhand index pointing up",
        "name_es": "dedo señalando arriba"
      },
      {
        "emoji": "🖕",
        "name_en": "middle finger",
        "name_es": "dedo medio"
      },
      {
        "emoji": "👇",
        "name_en": "backhand index pointing down",
        "name_es": "dedo señalando abajo"
      },
      {
        "emoji": "☝",
        "name_en": "index pointing up",
        "name_es": "dedo índice señalando arriba"
      },
      {
        "emoji": "👍",
        "name_en": "thumbs up",
        "name_es": "pulgar hacia arriba"
      },
      {
        "emoji": "👎",
        "name_en": "thumbs down",
        "name_es": "pulgar hacia abajo"
      },
      {
        "emoji": "✊",
        "name_en": "raised fist",
        "name_es": "puño levantado"
      },
      {
        "emoji": "👊",
        "name_en": "oncoming fist",
        "name_es": "puño de frente"
      },
      {
        "emoji": "🤛",
        "name_en": "left-facing fist",
        "name_es": "puño hacia la izquierda"
      },
      {
        "emoji": "🤜",
        "name_en": "right-facing fist",
        "name_es": "puño hacia la derecha"
      },
      {
        "emoji": "👏",
        "name_en": "clapping hands",
        "name_es": "manos aplaudiendo"
      },
      {
        "emoji": "🙌",
        "name_en": "raising hands",
        "name_es": "manos levantadas"
      },
      {
        "emoji": "👐",
        "name_en": "open hands",
        "name_es": "manos abiertas"
      },
      {
        "emoji": "🤲",
        "name_en": "palms up together",
        "name_es": "palmas hacia arriba juntas"
      },
      {
        "emoji": "🤝",
        "name_en": "handshake",
        "name_es": "apretón de manos"
      },
      {
        "emoji": "🙏",
        "name_en": "folded hands",
        "name_es": "manos plegadas"
      },
      {
        "emoji": "✍",
        "name_en": "writing hand",
        "name_es": "mano escribiendo"
      },
      {
        "emoji": "💅",
        "name_en": "nail polish",
        "name_es": "esmalte de uñas"
      },
      {
        "emoji": "🤳",
        "name_en": "selfie",
        "name_es": "selfie"
      },
      {
        "emoji": "💪",
        "name_en": "flexed biceps",
        "name_es": "bíceps flexionado"
      },
      {
        "emoji": "🦾",
        "name_en": "mechanical arm",
        "name_es": "brazo mecánico"
      },
      {
        "emoji": "🦿",
        "name_en": "mechanical leg",
        "name_es": "pierna mecánica"
      },
      {
        "emoji": "🦵",
        "name_en": "leg",
        "name_es": "pierna"
      },
      {
        "emoji": "🦶",
        "name_en": "foot",
        "name_es": "pie"
      },
      {
        "emoji": "👂",
        "name_en": "ear",
        "name_es": "oreja"
      },
      {
        "emoji": "🦻",
        "name_en": "ear with hearing aid",
        "name_es": "oreja con audífono"
      },
      {
        "emoji": "👃",
        "name_en": "nose",
        "name_es": "nariz"
      },
      {
        "emoji": "🧠",
        "name_en": "brain",
        "name_es": "cerebro"
      },
      {
        "emoji": "🫀",
        "name_en": "anatomical heart",
        "name_es": "corazón anatómico"
      },
      {
        "emoji": "🫁",
        "name_en": "lungs",
        "name_es": "pulmones"
      },
      {
        "emoji": "🦷",
        "name_en": "tooth",
        "name_es": "diente"
      },
      {
        "emoji": "🦴",
        "name_en": "bone",
        "name_es": "hueso"
      },
      {
        "emoji": "👀",
        "name_en": "eyes",
        "name_es": "ojos"
      },
      {
        "emoji": "👁",
        "name_en": "eye",
        "name_es": "ojo"
      },
      {
        "emoji": "👅",
        "name_en": "tongue",
        "name_es": "lengua"
      },
      {
        "emoji": "👄",
        "name_en": "mouth",
        "name_es": "boca"
      }
    ]
  },
  "people": {
    "icon": "🧑",
    "title": "People",
    "emojis": [
      {
        "emoji": "👶",
        "name_en": "baby",
        "name_es": "bebé"
      },
      {
        "emoji": "👧",
        "name_en": "girl",
        "name_es": "niña"
      },
      {
        "emoji": "🧒",
        "name_en": "child",
        "name_es": "niño/a"
      },
      {
        "emoji": "👦",
        "name_en": "boy",
        "name_es": "niño"
      },
      {
        "emoji": "👩",
        "name_en": "woman",
        "name_es": "mujer"
      },
      {
        "emoji": "👨",
        "name_en": "man",
        "name_es": "hombre"
      },
      {
        "emoji": "👵",
        "name_en": "older woman",
        "name_es": "mujer mayor"
      },
      {
        "emoji": "👴",
        "name_en": "older man",
        "name_es": "hombre mayor"
      },
      {
        "emoji": "👱‍♀️",
        "name_en": "woman with blond hair",
        "name_es": "mujer rubia"
      },
      {
        "emoji": "👱‍♂️",
        "name_en": "man with blond hair",
        "name_es": "hombre rubio"
      },
      {
        "emoji": "👨‍🦰",
        "name_en": "man with red hair",
        "name_es": "hombre con cabello rojo"
      },
      {
        "emoji": "👩‍🦰",
        "name_en": "woman with red hair",
        "name_es": "mujer con cabello rojo"
      },
      {
        "emoji": "👩‍🦳",
        "name_en": "woman with white hair",
        "name_es": "mujer con cabello blanco"
      },
      {
        "emoji": "👨‍🦳",
        "name_en": "man with white hair",
        "name_es": "hombre con cabello blanco"
      },
      {
        "emoji": "👩‍🦱",
        "name_en": "woman with curly hair",
        "name_es": "mujer con cabello rizado"
      },
      {
        "emoji": "👨‍🦱",
        "name_en": "man with curly hair",
        "name_es": "hombre con cabello rizado"
      },
      {
        "emoji": "👩‍🦲",
        "name_en": "woman with no hair",
        "name_es": "mujer sin cabello"
      },
      {
        "emoji": "👨‍🦲",
        "name_en": "man with no hair",
        "name_es": "hombre sin cabello"
      },
      {
        "emoji": "🧔",
        "name_en": "man with beard",
        "name_es": "hombre con barba"
      },
      {
        "emoji": "👶🏿",
        "name_en": "baby: dark skin tone",
        "name_es": "bebé: tono de piel oscuro"
      },
      {
        "emoji": "👧🏻",
        "name_en": "girl: light skin tone",
        "name_es": "niña: tono de piel claro"
      },
      {
        "emoji": "👨‍🦰🏽",
        "name_en": "man with red hair: medium skin tone",
        "name_es": "hombre con cabello rojo: tono de piel medio"
      },
      {
        "emoji": "🧑‍🦱",
        "name_en": "person with curly hair",
        "name_es": "persona con cabello rizado"
      },
      {
        "emoji": "👨‍🦰",
        "name_en": "man with red hair",
        "name_es": "hombre con cabello rojo"
      },
      {
        "emoji": "👩‍🦱",
        "name_en": "woman with curly hair",
        "name_es": "mujer con cabello rizado"
      },
      {
        "emoji": "🧔",
        "name_en": "man with beard",
        "name_es": "hombre con barba"
      },
      {
        "emoji": "👩‍🦲",
        "name_en": "woman with no hair",
        "name_es": "mujer sin cabello"
      },
      {
        "emoji": "🧑‍🦱",
        "name_en": "person with curly hair",
        "name_es": "persona con cabello rizado"
      },
      {
        "emoji": "👨‍🦲",
        "name_en": "man with no hair",
        "name_es": "hombre sin cabello"
      },
      {
        "emoji": "👵🏻",
        "name_en": "older woman: light skin tone",
        "name_es": "mujer mayor: tono de piel claro"
      },
      {
        "emoji": "🧓",
        "name_en": "older adult",
        "name_es": "persona mayor"
      },
      {
        "emoji": "👨‍👩‍👧",
        "name_en": "family: man, woman, girl",
        "name_es": "familia: hombre, mujer, niña"
      },
      {
        "emoji": "👨‍👩‍👧‍👦",
        "name_en": "family: man, woman, girl, boy",
        "name_es": "familia: hombre, mujer, niña, niño"
      },
      {
        "emoji": "👨‍👧",
        "name_en": "man and daughter",
        "name_es": "hombre y su hija"
      },
      {
        "emoji": "👩‍👧",
        "name_en": "woman and daughter",
        "name_es": "mujer y su hija"
      },
      {
        "emoji": "🧒🏻",
        "name_en": "child: light skin tone",
        "name_es": "niño/a: tono de piel claro"
      },
      {
        "emoji": "👨‍👦",
        "name_en": "man and son",
        "name_es": "hombre y su hijo"
      },
      {
        "emoji": "👩‍👦",
        "name_en": "woman and son",
        "name_es": "mujer y su hijo"
      },
      {
        "emoji": "🧓",
        "name_en": "older adult",
        "name_es": "persona mayor"
      }
    ]
  },
  "nature": {
    "icon": "🌿",
    "title": "Nature",
    "emojis": [
      {
        "emoji": "🌲",
        "name_en": "evergreen tree",
        "name_es": "árbol perenne"
      },
      {
        "emoji": "🌳",
        "name_en": "deciduous tree",
        "name_es": "árbol de hoja caduca"
      },
      {
        "emoji": "🌴",
        "name_en": "palm tree",
        "name_es": "palmera"
      },
      {
        "emoji": "🌵",
        "name_en": "cactus",
        "name_es": "cactus"
      },
      {
        "emoji": "🌷",
        "name_en": "tulip",
        "name_es": "tulipán"
      },
      {
        "emoji": "🌸",
        "name_en": "cherry blossom",
        "name_es": "flor de cerezo"
      },
      {
        "emoji": "🌹",
        "name_en": "rose",
        "name_es": "rosa"
      },
      {
        "emoji": "🌺",
        "name_en": "hibiscus",
        "name_es": "hibisco"
      },
      {
        "emoji": "🌻",
        "name_en": "sunflower",
        "name_es": "girasol"
      },
      {
        "emoji": "🌼",
        "name_en": "blossom",
        "name_es": "floración"
      },
      {
        "emoji": "🌾",
        "name_en": "sheaf of rice",
        "name_es": "manojo de arroz"
      },
      {
        "emoji": "🌿",
        "name_en": "herb",
        "name_es": "hierba"
      },
      {
        "emoji": "🍀",
        "name_en": "four leaf clover",
        "name_es": "trébol de cuatro hojas"
      },
      {
        "emoji": "🍁",
        "name_en": "maple leaf",
        "name_es": "hoja de arce"
      },
      {
        "emoji": "🍂",
        "name_en": "fallen leaf",
        "name_es": "hoja caída"
      },
      {
        "emoji": "🍃",
        "name_en": "leaf fluttering in wind",
        "name_es": "hoja ondeando en el viento"
      },
      {
        "emoji": "🍄",
        "name_en": "mushroom",
        "name_es": "hongo"
      }
    ]
  },
  "food": {
    "icon": "🍔",
    "title": "Food",
    "emojis": [
      {
        "emoji": "🍏",
        "name_en": "green apple",
        "name_es": "manzana verde"
      },
      {
        "emoji": "🍎",
        "name_en": "red apple",
        "name_es": "manzana roja"
      },
      {
        "emoji": "🍐",
        "name_en": "pear",
        "name_es": "pera"
      },
      {
        "emoji": "🍊",
        "name_en": "tangerine",
        "name_es": "mandarina"
      },
      {
        "emoji": "🍋",
        "name_en": "lemon",
        "name_es": "limón"
      },
      {
        "emoji": "🍌",
        "name_en": "banana",
        "name_es": "banana"
      },
      {
        "emoji": "🍉",
        "name_en": "watermelon",
        "name_es": "sandía"
      },
      {
        "emoji": "🍇",
        "name_en": "grapes",
        "name_es": "uvas"
      },
      {
        "emoji": "🍓",
        "name_en": "strawberry",
        "name_es": "fresa"
      },
      {
        "emoji": "🍈",
        "name_en": "melon",
        "name_es": "melón"
      },
      {
        "emoji": "🍒",
        "name_en": "cherries",
        "name_es": "cerezas"
      },
      {
        "emoji": "🍑",
        "name_en": "peach",
        "name_es": "durazno"
      },
      {
        "emoji": "🥭",
        "name_en": "mango",
        "name_es": "mango"
      },
      {
        "emoji": "🍍",
        "name_en": "pineapple",
        "name_es": "piña"
      },
      {
        "emoji": "🥥",
        "name_en": "coconut",
        "name_es": "coco"
      },
      {
        "emoji": "🥝",
        "name_en": "kiwi fruit",
        "name_es": "kiwi"
      },
      {
        "emoji": "🍅",
        "name_en": "tomato",
        "name_es": "tomate"
      },
      {
        "emoji": "🍆",
        "name_en": "eggplant",
        "name_es": "berenjena"
      },
      {
        "emoji": "🥑",
        "name_en": "avocado",
        "name_es": "aguacate"
      },
      {
        "emoji": "🥦",
        "name_en": "broccoli",
        "name_es": "brócoli"
      },
      {
        "emoji": "🥒",
        "name_en": "cucumber",
        "name_es": "pepino"
      }
    ]
  },
  "activities": {
    "icon": "⚽",
    "title": "Activities",
    "emojis": [
      {
        "emoji": "⚽",
        "name_en": "soccer ball",
        "name_es": "balón de fútbol"
      },
      {
        "emoji": "🏀",
        "name_en": "basketball",
        "name_es": "baloncesto"
      },
      {
        "emoji": "🏈",
        "name_en": "american football",
        "name_es": "fútbol americano"
      },
      {
        "emoji": "⚾",
        "name_en": "baseball",
        "name_es": "béisbol"
      },
      {
        "emoji": "🎾",
        "name_en": "tennis",
        "name_es": "tenis"
      },
      {
        "emoji": "🏐",
        "name_en": "volleyball",
        "name_es": "voleibol"
      },
      {
        "emoji": "🏉",
        "name_en": "rugby football",
        "name_es": "rugby"
      },
      {
        "emoji": "🎱",
        "name_en": "pool 8 ball",
        "name_es": "billar"
      },
      {
        "emoji": "🏓",
        "name_en": "ping pong",
        "name_es": "ping pong"
      },
      {
        "emoji": "🏸",
        "name_en": "badminton",
        "name_es": "bádminton"
      },
      {
        "emoji": "🥅",
        "name_en": "goal net",
        "name_es": "red de portería"
      },
      {
        "emoji": "🏒",
        "name_en": "ice hockey",
        "name_es": "hockey sobre hielo"
      },
      {
        "emoji": "🏑",
        "name_en": "field hockey",
        "name_es": "hockey sobre césped"
      },
      {
        "emoji": "🏏",
        "name_en": "cricket game",
        "name_es": "partido de críquet"
      },
      {
        "emoji": "⛳",
        "name_en": "flag in hole",
        "name_es": "bandera en el agujero"
      },
      {
        "emoji": "🏹",
        "name_en": "bow and arrow",
        "name_es": "arco y flecha"
      },
      {
        "emoji": "🎣",
        "name_en": "fishing pole",
        "name_es": "caña de pescar"
      },
      {
        "emoji": "🤿",
        "name_en": "diving mask",
        "name_es": "máscara de buceo"
      },
      {
        "emoji": "🎽",
        "name_en": "running shirt",
        "name_es": "camiseta de correr"
      },
      {
        "emoji": "🎿",
        "name_en": "ski and ski boot",
        "name_es": "esquí y bota de esquí"
      },
      {
        "emoji": "🛷",
        "name_en": "sled",
        "name_es": "trineo"
      },
      {
        "emoji": "🥌",
        "name_en": "curling stone",
        "name_es": "piedra de curling"
      }
    ]
  },
  "animals": {
    "icon": "🐻",
    "title": "Animals",
    "emojis": [
      {
        "emoji": "🐵",
        "name_en": "monkey face",
        "name_es": "cara de mono"
      },
      {
        "emoji": "🐒",
        "name_en": "monkey",
        "name_es": "mono"
      },
      {
        "emoji": "🦍",
        "name_en": "gorilla",
        "name_es": "gorila"
      },
      {
        "emoji": "🦧",
        "name_en": "orangutan",
        "name_es": "orangután"
      },
      {
        "emoji": "🐶",
        "name_en": "dog face",
        "name_es": "cara de perro"
      },
      {
        "emoji": "🐕",
        "name_en": "dog",
        "name_es": "perro"
      },
      {
        "emoji": "🦮",
        "name_en": "guide dog",
        "name_es": "perro guía"
      },
      {
        "emoji": "🐕‍🦺",
        "name_en": "service dog",
        "name_es": "perro de servicio"
      },
      {
        "emoji": "🐩",
        "name_en": "poodle",
        "name_es": "caniche"
      },
      {
        "emoji": "🐺",
        "name_en": "wolf",
        "name_es": "lobo"
      },
      {
        "emoji": "🦊",
        "name_en": "fox",
        "name_es": "zorro"
      },
      {
        "emoji": "🦝",
        "name_en": "raccoon",
        "name_es": "mapache"
      },
      {
        "emoji": "🐱",
        "name_en": "cat face",
        "name_es": "cara de gato"
      },
      {
        "emoji": "🐈",
        "name_en": "cat",
        "name_es": "gato"
      },
      {
        "emoji": "🐈‍⬛",
        "name_en": "black cat",
        "name_es": "gato negro"
      },
      {
        "emoji": "🦁",
        "name_en": "lion",
        "name_es": "león"
      },
      {
        "emoji": "🐯",
        "name_en": "tiger face",
        "name_es": "cara de tigre"
      },
      {
        "emoji": "🐅",
        "name_en": "tiger",
        "name_es": "tigre"
      },
      {
        "emoji": "🐆",
        "name_en": "leopard",
        "name_es": "leopardo"
      },
      {
        "emoji": "🐴",
        "name_en": "horse face",
        "name_es": "cara de caballo"
      },
      {
        "emoji": "🐎",
        "name_en": "horse",
        "name_es": "caballo"
      },
      {
        "emoji": "🦄",
        "name_en": "unicorn",
        "name_es": "unicornio"
      },
      {
        "emoji": "🦓",
        "name_en": "zebra",
        "name_es": "cebra"
      },
      {
        "emoji": "🦌",
        "name_en": "deer",
        "name_es": "ciervo"
      },
      {
        "emoji": "🐮",
        "name_en": "cow face",
        "name_es": "cara de vaca"
      },
      {
        "emoji": "🐄",
        "name_en": "cow",
        "name_es": "vaca"
      },
      {
        "emoji": "🐂",
        "name_en": "ox",
        "name_es": "buey"
      },
      {
        "emoji": "🐃",
        "name_en": "water buffalo",
        "name_es": "búfalo de agua"
      },
      {
        "emoji": "🐄",
        "name_en": "cow",
        "name_es": "vaca"
      },
      {
        "emoji": "🐷",
        "name_en": "pig face",
        "name_es": "cara de cerdo"
      },
      {
        "emoji": "🐖",
        "name_en": "pig",
        "name_es": "cerdo"
      },
      {
        "emoji": "🐗",
        "name_en": "boar",
        "name_es": "jabalí"
      },
      {
        "emoji": "🐏",
        "name_en": "ram",
        "name_es": "carnero"
      },
      {
        "emoji": "🐑",
        "name_en": "ewe",
        "name_es": "oveja"
      },
      {
        "emoji": "🐐",
        "name_en": "goat",
        "name_es": "cabra"
      },
      {
        "emoji": "🐪",
        "name_en": "camel",
        "name_es": "camello"
      },
      {
        "emoji": "🐫",
        "name_en": "two-hump camel",
        "name_es": "camello de dos jorobas"
      },
      {
        "emoji": "🦙",
        "name_en": "llama",
        "name_es": "llama"
      },
      {
        "emoji": "🦒",
        "name_en": "giraffe",
        "name_es": "jirafa"
      },
      {
        "emoji": "🐘",
        "name_en": "elephant",
        "name_es": "elefante"
      },
      {
        "emoji": "🦏",
        "name_en": "rhinoceros",
        "name_es": "rinoceronte"
      },
      {
        "emoji": "🦛",
        "name_en": "hippopotamus",
        "name_es": "hipopótamo"
      },
      {
        "emoji": "🐁",
        "name_en": "mouse",
        "name_es": "ratón"
      },
      {
        "emoji": "🐀",
        "name_en": "rat",
        "name_es": "rata"
      },
      {
        "emoji": "🐹",
        "name_en": "hamster face",
        "name_es": "cara de hámster"
      },
      {
        "emoji": "🐰",
        "name_en": "rabbit face",
        "name_es": "cara de conejo"
      },
      {
        "emoji": "🐇",
        "name_en": "rabbit",
        "name_es": "conejo"
      },
      {
        "emoji": "🐿",
        "name_en": "chipmunk",
        "name_es": "ardilla"
      },
      {
        "emoji": "🦔",
        "name_en": "hedgehog",
        "name_es": "erizo"
      },
      {
        "emoji": "🦇",
        "name_en": "bat",
        "name_es": "murciélago"
      },
      {
        "emoji": "🐻",
        "name_en": "bear",
        "name_es": "oso"
      },
      {
        "emoji": "🐻‍❄️",
        "name_en": "polar bear",
        "name_es": "oso polar"
      },
      {
        "emoji": "🐨",
        "name_en": "koala",
        "name_es": "koala"
      },
      {
        "emoji": "🐼",
        "name_en": "panda",
        "name_es": "panda"
      },
      {
        "emoji": "🦥",
        "name_en": "sloth",
        "name_es": "perezoso"
      },
      {
        "emoji": "🦦",
        "name_en": "otter",
        "name_es": "nutria"
      },
      {
        "emoji": "🦨",
        "name_en": "skunk",
        "name_es": "mofeta"
      },
      {
        "emoji": "🦘",
        "name_en": "kangaroo",
        "name_es": "canguro"
      },
      {
        "emoji": "🦡",
        "name_en": "badger",
        "name_es": "tejón"
      },
      {
        "emoji": "🐾",
        "name_en": "paw prints",
        "name_es": "huellas"
      },
      {
        "emoji": "🦃",
        "name_en": "turkey",
        "name_es": "pavo"
      },
      {
        "emoji": "🐔",
        "name_en": "chicken",
        "name_es": "pollo"
      },
      {
        "emoji": "🐓",
        "name_en": "rooster",
        "name_es": "gallo"
      },
      {
        "emoji": "🐣",
        "name_en": "hatching chick",
        "name_es": "pollito saliendo del cascarón"
      },
      {
        "emoji": "🐤",
        "name_en": "baby chick",
        "name_es": "pollito"
      },
      {
        "emoji": "🐦",
        "name_en": "bird",
        "name_es": "pájaro"
      },
      {
        "emoji": "🐧",
        "name_en": "penguin",
        "name_es": "pingüino"
      },
      {
        "emoji": "🕊",
        "name_en": "dove",
        "name_es": "paloma"
      },
      {
        "emoji": "🦅",
        "name_en": "eagle",
        "name_es": "águila"
      },
      {
        "emoji": "🦆",
        "name_en": "duck",
        "name_es": "pato"
      },
      {
        "emoji": "🦢",
        "name_en": "swan",
        "name_es": "cisne"
      },
      {
        "emoji": "🦉",
        "name_en": "owl",
        "name_es": "búho"
      },
      {
        "emoji": "🦩",
        "name_en": "flamingo",
        "name_es": "flamenco"
      },
      {
        "emoji": "🦚",
        "name_en": "peacock",
        "name_es": "pavo real"
      },
      {
        "emoji": "🦜",
        "name_en": "parrot",
        "name_es": "loro"
      },
      {
        "emoji": "🦤",
        "name_en": "dodo",
        "name_es": "dodo"
      },
      {
        "emoji": "🐸",
        "name_en": "frog",
        "name_es": "rana"
      },
      {
        "emoji": "🐊",
        "name_en": "crocodile",
        "name_es": "cocodrilo"
      },
      {
        "emoji": "🐢",
        "name_en": "turtle",
        "name_es": "tortuga"
      },
      {
        "emoji": "🦎",
        "name_en": "lizard",
        "name_es": "lagarto"
      },
      {
        "emoji": "🐍",
        "name_en": "snake",
        "name_es": "serpiente"
      },
      {
        "emoji": "🐉",
        "name_en": "dragon",
        "name_es": "dragón"
      },
      {
        "emoji": "🦕",
        "name_en": "sauropod",
        "name_es": "saurópodo"
      },
      {
        "emoji": "🦖",
        "name_en": "T-Rex",
        "name_es": "T-Rex"
      }
    ]
  }
};