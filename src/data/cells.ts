/* ===== DADOS DAS CÉLULAS ===== */

export interface CellPart {
  id: number;
  name: string;
  icon: string;
  analogy: string;
  description: string;
  x: number; // percentual
  y: number; // percentual
  color: string;
}

export interface CellData {
  type: 'animal' | 'vegetal';
  name: string;
  parts: CellPart[];
}

export const animalCell: CellData = {
  type: 'animal',
  name: 'Célula Animal',
  parts: [
    {
      id: 1,
      name: 'Membrana Celular',
      icon: '🛡️',
      analogy: 'Como a pele do seu corpo — protege o que está dentro.',
      description: 'É uma fininha camada que envolve a célula. Ela decide o que entra e o que sai.',
      x: 50,
      y: 10,
      color: '#f59e0b'
    },
    {
      id: 2,
      name: 'Núcleo',
      icon: '🧠',
      analogy: 'Como o cérebro — é o chefe que comanda tudo!',
      description: 'É o centro de controle da célula. Guarda o DNA, que é como uma receita de bolo da vida.',
      x: 45,
      y: 40,
      color: '#8b5cf6'
    },
    {
      id: 3,
      name: 'Mitocôndria',
      icon: '⚡',
      analogy: 'Como uma bateria — dá energia para a célula funcionar!',
      description: 'Produz energia para a célula. É como uma usina de força bem pequenininha.',
      x: 72,
      y: 35,
      color: '#ef4444'
    },
    {
      id: 4,
      name: 'Citoplasma',
      icon: '💧',
      analogy: 'Como a gelatina — preenche todo o espaço dentro da célula.',
      description: 'É a parte gelatinosa que fica entre a membrana e o núcleo. Tudo fica boiando nele!',
      x: 30,
      y: 65,
      color: '#06b6d4'
    },
    {
      id: 5,
      name: 'Ribossomos',
      icon: '🔧',
      analogy: 'Como uma fábrica de brinquedos — fazem as proteínas!',
      description: 'São bem pequenos e fazem proteínas. As proteínas são como tijolinhos do corpo.',
      x: 65,
      y: 60,
      color: '#10b981'
    },
    {
      id: 6,
      name: 'Retículo Endoplasmático',
      icon: '🛤️',
      analogy: 'Como uma estrada dentro da célula — transporta coisas.',
      description: 'É como um labirinto de estradinhas. Transporta materiais dentro da célula.',
      x: 25,
      y: 35,
      color: '#f97316'
    },
    {
      id: 7,
      name: 'Complexo de Golgi',
      icon: '📦',
      analogy: 'Como os Correios — empacota e envia coisas para onde precisam.',
      description: 'Empacota proteínas e outras substâncias para enviar para onde a célula precisa.',
      x: 60,
      y: 75,
      color: '#ec4899'
    },
    {
      id: 8,
      name: 'Lisossomo',
      icon: '🗑️',
      analogy: 'Como o lixeiro — limpa e recicla o que não serve mais.',
      description: 'Faz a digestão dentro da célula. Destrói o que está velho ou não serve mais.',
      x: 80,
      y: 55,
      color: '#84cc16'
    }
  ]
};

export const vegetalCell: CellData = {
  type: 'vegetal',
  name: 'Célula Vegetal',
  parts: [
    {
      id: 1,
      name: 'Parede Celular',
      icon: '🧱',
      analogy: 'Como uma casca grossa — dá firmeza para a planta ficar em pé!',
      description: 'É uma camada dura por fora da membrana. É ela que deixa a planta firme e durinha.',
      x: 50,
      y: 8,
      color: '#65a30d'
    },
    {
      id: 2,
      name: 'Membrana Celular',
      icon: '🛡️',
      analogy: 'Como a pele — protege o que está dentro da célula.',
      description: 'Fica logo abaixo da parede celular. Controla o que entra e sai da célula.',
      x: 50,
      y: 18,
      color: '#f59e0b'
    },
    {
      id: 3,
      name: 'Cloroplasto',
      icon: '🌿',
      analogy: 'Como painéis solares — usam a luz do sol para fazer comida!',
      description: 'São verdes e fazem a fotossíntese. Usam luz do sol para fazer o alimento da planta.',
      x: 25,
      y: 40,
      color: '#22c55e'
    },
    {
      id: 4,
      name: 'Vacúolo Central',
      icon: '💎',
      analogy: 'Como uma garrafinha de água — guarda água e mantém a célula cheia.',
      description: 'É um saco grande cheio de água. Deixa a célula bem cheia e firme. É bem grande na célula vegetal!',
      x: 50,
      y: 50,
      color: '#3b82f6'
    },
    {
      id: 5,
      name: 'Núcleo',
      icon: '🧠',
      analogy: 'Como o cérebro — comanda tudo na célula!',
      description: 'É o centro de controle. Tem o DNA, que é a receita de como a planta deve ser.',
      x: 35,
      y: 30,
      color: '#8b5cf6'
    },
    {
      id: 6,
      name: 'Mitocôndria',
      icon: '⚡',
      analogy: 'Como uma bateria — dá energia!',
      description: 'Produz energia para a célula. Igual na célula animal, é a usina de força.',
      x: 75,
      y: 35,
      color: '#ef4444'
    },
    {
      id: 7,
      name: 'Citoplasma',
      icon: '💧',
      analogy: 'Como gelatina — preenche o espaço dentro da célula.',
      description: 'É a parte gelatinosa onde ficam todas as outras partes da célula.',
      x: 70,
      y: 65,
      color: '#06b6d4'
    },
    {
      id: 8,
      name: 'Ribossomos',
      icon: '🔧',
      analogy: 'Como uma fábrica — fazem proteínas para a célula.',
      description: 'São bem pequenos e fabricam proteínas, que são importantes para tudo funcionar.',
      x: 30,
      y: 70,
      color: '#10b981'
    }
  ]
};

/* ===== DADOS DO QUIZ ===== */

export type Difficulty = 'facil' | 'medio' | 'dificil';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number; // índice da opção correta
  explanation: string;
  cellType: 'animal' | 'vegetal' | 'ambas';
  difficulty: Difficulty;
}

export const quizQuestions: QuizQuestion[] = [
  // ===== FÁCIL (12 perguntas) =====
  {
    id: 1,
    question: 'Qual parte da célula é como o "cérebro" que comanda tudo?',
    options: ['Mitocôndria', 'Núcleo', 'Ribossomo', 'Lisossomo'],
    correct: 1,
    explanation: 'O núcleo é o centro de controle! Ele guarda o DNA e comanda tudo na célula.',
    cellType: 'ambas',
    difficulty: 'facil'
  },
  {
    id: 2,
    question: 'Qual parte dá energia para a célula funcionar?',
    options: ['Vacúolo', 'Complexo de Golgi', 'Mitocôndria', 'Retículo'],
    correct: 2,
    explanation: 'A mitocôndria é como uma bateria! Ela produz energia para a célula toda.',
    cellType: 'ambas',
    difficulty: 'facil'
  },
  {
    id: 3,
    question: 'O que a célula vegetal tem que a animal NÃO tem?',
    options: ['Núcleo', 'Mitocôndria', 'Cloroplasto', 'Membrana'],
    correct: 2,
    explanation: 'O cloroplasto é só da célula vegetal! Ele é verde e faz a fotossíntese.',
    cellType: 'vegetal',
    difficulty: 'facil'
  },
  {
    id: 4,
    question: 'A parede celular é como o quê?',
    options: ['Uma gelatina', 'Uma casca grossa e dura', 'Uma estrada', 'Uma bateria'],
    correct: 1,
    explanation: 'A parede celular é dura e firme, como uma casca! Ela deixa a planta em pé.',
    cellType: 'vegetal',
    difficulty: 'facil'
  },
  {
    id: 5,
    question: 'O que o vacúolo central guarda?',
    options: ['DNA', 'Proteínas', 'Água', 'Energia'],
    correct: 2,
    explanation: 'O vacúolo é como uma garrafinha! Ele guarda água e deixa a célula bem cheia.',
    cellType: 'vegetal',
    difficulty: 'facil'
  },
  {
    id: 6,
    question: 'O cloroplasto usa o quê para fazer comida?',
    options: ['Escuridão', 'Luz do sol', 'Água gelada', 'Ar frio'],
    correct: 1,
    explanation: 'O cloroplasto usa a luz do sol para fazer fotossíntese e produzir alimento!',
    cellType: 'vegetal',
    difficulty: 'facil'
  },
  {
    id: 7,
    question: 'Qual parte é como os "Correios" da célula?',
    options: ['Núcleo', 'Complexo de Golgi', 'Citoplasma', 'Lisossomo'],
    correct: 1,
    explanation: 'O Complexo de Golgi empacota e envia materiais, igual os Correios!',
    cellType: 'animal',
    difficulty: 'facil'
  },
  {
    id: 8,
    question: 'A membrana celular faz o quê?',
    options: ['Produz energia', 'Decide o que entra e sai', 'Faz fotossíntese', 'Guarda DNA'],
    correct: 1,
    explanation: 'A membrana é como um porteiro! Ela decide o que pode entrar e o que pode sair.',
    cellType: 'ambas',
    difficulty: 'facil'
  },
  {
    id: 9,
    question: 'O lisossomo é como o quê?',
    options: ['O chefe', 'O lixeiro', 'A bateria', 'A estrada'],
    correct: 1,
    explanation: 'O lisossomo é como um lixeiro! Ele limpa e recicla o que não serve mais.',
    cellType: 'animal',
    difficulty: 'facil'
  },
  {
    id: 10,
    question: 'O citoplasma parece com o quê?',
    options: ['Uma pedra', 'Uma gelatina', 'Um tijolo', 'Uma folha'],
    correct: 1,
    explanation: 'O citoplasma é gelatinoso! Ele preenche todo o espaço dentro da célula.',
    cellType: 'ambas',
    difficulty: 'facil'
  },
  {
    id: 11,
    question: 'Qual a cor dos cloroplastos?',
    options: ['Azul', 'Vermelho', 'Verde', 'Amarelo'],
    correct: 2,
    explanation: 'Os cloroplastos são verdes! É essa cor que deixa as plantas verdinhas.',
    cellType: 'vegetal',
    difficulty: 'facil'
  },
  {
    id: 12,
    question: 'Todas as células têm o quê?',
    options: ['Cloroplasto', 'Parede celular', 'Membrana', 'Vacúolo grande'],
    correct: 2,
    explanation: 'Toda célula tem membrana! Ela protege o que está dentro.',
    cellType: 'ambas',
    difficulty: 'facil'
  },

  // ===== MÉDIO (12 perguntas) =====
  {
    id: 13,
    question: 'Onde fica guardado o DNA da célula?',
    options: ['Na mitocôndria', 'No núcleo', 'No ribossomo', 'No vacúolo'],
    correct: 1,
    explanation: 'O DNA fica no núcleo! Ele é como uma receita de bolo da vida.',
    cellType: 'ambas',
    difficulty: 'medio'
  },
  {
    id: 14,
    question: 'O que são os ribossomos?',
    options: ['Fábricas de proteínas', 'Usinas de energia', 'Depósitos de água', 'Lixeiras'],
    correct: 0,
    explanation: 'Os ribossomos são fábricas! Eles produzem proteínas para a célula.',
    cellType: 'ambas',
    difficulty: 'medio'
  },
  {
    id: 15,
    question: 'O retículo endoplasmático é parecido com:',
    options: ['Uma bola', 'Uma estrada interna', 'Uma parede', 'Uma bateria'],
    correct: 1,
    explanation: 'O retículo é como uma rede de estradas! Transporta coisas dentro da célula.',
    cellType: 'ambas',
    difficulty: 'medio'
  },
  {
    id: 16,
    question: 'Qual a diferença principal entre célula animal e vegetal?',
    options: ['O tamanho', 'A cor', 'A forma e partes especiais', 'Não tem diferença'],
    correct: 2,
    explanation: 'A célula vegetal tem parede, cloroplasto e vacúolo grande. A animal não!',
    cellType: 'ambas',
    difficulty: 'medio'
  },
  {
    id: 17,
    question: 'O que é fotossíntese?',
    options: ['Produzir energia com luz', 'Comer outros seres', 'Respirar oxigênio', 'Dormir'],
    correct: 0,
    explanation: 'Fotossíntese é usar luz do sol para fazer alimento! Só plantas fazem isso.',
    cellType: 'vegetal',
    difficulty: 'medio'
  },
  {
    id: 18,
    question: 'Por que a célula vegetal é mais firme?',
    options: ['Tem mais água', 'Tem parede celular', 'É maior', 'Tem mais núcleo'],
    correct: 1,
    explanation: 'A parede celular é dura! Ela deixa a planta firme e em pé.',
    cellType: 'vegetal',
    difficulty: 'medio'
  },
  {
    id: 19,
    question: 'O nucléolo fica dentro de qual organela?',
    options: ['Mitocôndria', 'Núcleo', 'Golgi', 'Lisossomo'],
    correct: 1,
    explanation: 'O nucléolo fica dentro do núcleo! Ele ajuda a fabricar ribossomos.',
    cellType: 'ambas',
    difficulty: 'medio'
  },
  {
    id: 20,
    question: 'Quantas mitocôndrias uma célula pode ter?',
    options: ['Apenas 1', 'Nenhuma', 'Centenas ou milhares', 'Exatamente 10'],
    correct: 2,
    explanation: 'Células podem ter centenas ou milhares de mitocôndrias! Depende da energia que precisam.',
    cellType: 'ambas',
    difficulty: 'medio'
  },
  {
    id: 21,
    question: 'O que o Complexo de Golgi faz com as proteínas?',
    options: ['Destrói', 'Empacota e envia', 'Guarda para sempre', 'Transforma em água'],
    correct: 1,
    explanation: 'O Golgi empacota as proteínas e envia para onde a célula precisa!',
    cellType: 'animal',
    difficulty: 'medio'
  },
  {
    id: 22,
    question: 'O vacúolo da célula vegetal é:',
    options: ['Pequeno', 'Muito grande', 'Não existe', 'Igual ao da animal'],
    correct: 1,
    explanation: 'O vacúolo vegetal é enorme! Ocupa muito espaço e guarda água.',
    cellType: 'vegetal',
    difficulty: 'medio'
  },
  {
    id: 23,
    question: 'Qual organela faz a "digestão" da célula?',
    options: ['Núcleo', 'Mitocôndria', 'Lisossomo', 'Ribossomo'],
    correct: 2,
    explanation: 'O lisossomo digere! Ele quebra o que não serve mais na célula.',
    cellType: 'animal',
    difficulty: 'medio'
  },
  {
    id: 24,
    question: 'O que são os poros nucleares?',
    options: ['Buracos na parede', 'Portinhas do núcleo', 'Mitocôndrias pequenas', 'Ribossomos'],
    correct: 1,
    explanation: 'Poros nucleares são portinhas! Controlam o que entra e sai do núcleo.',
    cellType: 'ambas',
    difficulty: 'medio'
  },

  // ===== DIFÍCIL (10 perguntas) =====
  {
    id: 25,
    question: 'As cristas mitocondriais servem para:',
    options: ['Dar cor', 'Aumentar a superfície para produzir energia', 'Guardar água', 'Fazer fotossíntese'],
    correct: 1,
    explanation: 'As cristas aumentam a superfície! Assim a mitocôndria produz mais energia.',
    cellType: 'ambas',
    difficulty: 'dificil'
  },
  {
    id: 26,
    question: 'O que são tilacoides?',
    options: ['Partes do núcleo', 'Discos dentro do cloroplasto', 'Tipos de ribossomo', 'Paredes celulares'],
    correct: 1,
    explanation: 'Tilacoides são discos verdes no cloroplasto! É onde acontece a fotossíntese.',
    cellType: 'vegetal',
    difficulty: 'dificil'
  },
  {
    id: 27,
    question: 'O retículo endoplasmático rugoso tem:',
    options: ['Cloroplastos', 'Ribossomos aderidos', 'Mitocôndrias', 'DNA'],
    correct: 1,
    explanation: 'O RE rugoso tem ribossomos grudados! Por isso ele faz proteínas.',
    cellType: 'ambas',
    difficulty: 'dificil'
  },
  {
    id: 28,
    question: 'O que são centríolos?',
    options: ['Organelas que ajudam na divisão celular', 'Tipos de núcleo', 'Cloroplastos pequenos', 'Paredes internas'],
    correct: 0,
    explanation: 'Centríolos ajudam a célula a se dividir! Só existem em células animais.',
    cellType: 'animal',
    difficulty: 'dificil'
  },
  {
    id: 29,
    question: 'A bicamada lipídica da membrana é feita de:',
    options: ['Açúcar', 'Gordura', 'Proteína pura', 'Água'],
    correct: 1,
    explanation: 'A membrana é feita de gordura (lipídios)! Duas camadas, como um sanduíche.',
    cellType: 'ambas',
    difficulty: 'dificil'
  },
  {
    id: 30,
    question: 'O citoesqueleto é como:',
    options: ['A pele da célula', 'Os ossos e músculos da célula', 'O cérebro', 'O sangue'],
    correct: 1,
    explanation: 'O citoesqueleto dá forma! São microtúbulos como ossinhos dentro da célula.',
    cellType: 'ambas',
    difficulty: 'dificil'
  },
  {
    id: 31,
    question: 'Peroxissomos servem para:',
    options: ['Fazer fotossíntese', 'Neutralizar substâncias tóxicas', 'Guardar DNA', 'Produzir açúcar'],
    correct: 1,
    explanation: 'Peroxissomos detoxificam! Eles neutralizam substâncias perigosas para a célula.',
    cellType: 'animal',
    difficulty: 'dificil'
  },
  {
    id: 32,
    question: 'O estroma do cloroplasto é:',
    options: ['Um líquido interno', 'A parede externa', 'Um tipo de DNA', 'Uma mitocôndria'],
    correct: 0,
    explanation: 'O estroma é o líquido dentro do cloroplasto! Onde acontece parte da fotossíntese.',
    cellType: 'vegetal',
    difficulty: 'dificil'
  },
  {
    id: 33,
    question: 'Quantos centríolos tem um centrrossomo?',
    options: ['1', '2, perpendiculares', '3', '10'],
    correct: 1,
    explanation: 'São 2 centríolos, um deitado e outro em pé! Formam um L.',
    cellType: 'animal',
    difficulty: 'dificil'
  },
  {
    id: 34,
    question: 'O que é um granum?',
    options: ['Um tipo de núcleo', 'Pilha de tilacoides', 'Uma mitocôndria', 'Um lisossomo'],
    correct: 1,
    explanation: 'Granum é uma pilha de tilacoides! Parece uma moedinha dentro do cloroplasto.',
    cellType: 'vegetal',
    difficulty: 'dificil'
  }
];

/* ===== CONQUISTAS ===== */

export interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  condition: string;
}

export const achievements: Achievement[] = [
  { id: 'first_explore', name: 'Explorador Iniciante', icon: '🔍', description: 'Explorou sua primeira célula', condition: 'Clique em qualquer parte da célula' },
  { id: 'all_animal', name: 'Expert Animal', icon: '🐾', description: 'Conheceu todas as partes da célula animal', condition: 'Visualize todas as 8 partes' },
  { id: 'all_vegetal', name: 'Expert Vegetal', icon: '🌱', description: 'Conheceu todas as partes da célula vegetal', condition: 'Visualize todas as 8 partes' },
  { id: 'quiz_first', name: 'Quizzer', icon: '📝', description: 'Completou o quiz pela primeira vez', condition: 'Termine o quiz' },
  { id: 'quiz_perfect', name: 'Gênio!', icon: '🏆', description: 'Acertou todas as perguntas do quiz', condition: '100% no quiz' },
  { id: 'quiz_streak', name: 'Em chamas!', icon: '🔥', description: 'Acertou 5 perguntas seguidas', condition: '5 acertos seguidos' },
  { id: 'voice_on', name: 'Ouvinte', icon: '🔊', description: 'Usou a leitura em voz alta', condition: 'Ative a voz' },
  { id: 'all_modes', name: 'Acessível!', icon: '♿', description: 'Experimentou todos os modos de acessibilidade', condition: 'Use todos os 5 botões' },
];
