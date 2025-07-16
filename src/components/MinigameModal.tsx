import React, { useState, useEffect } from 'react';
import './MinigameModal.css';

interface Questao {
  pergunta: string;
  alternativas: string[];
  correta: number;
}

interface MinigameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Função para embaralhar alternativas e atualizar o índice da correta
function shuffleAlternativas(questao: Questao): Questao {
  const alternativasComIndice = questao.alternativas.map((alt, idx) => ({ alt, idx }));
  const embaralhadas = shuffleArray(alternativasComIndice);
  const novasAlternativas = embaralhadas.map(obj => obj.alt);
  const novoCorreta = embaralhadas.findIndex(obj => obj.idx === questao.correta);
  return {
    ...questao,
    alternativas: novasAlternativas,
    correta: novoCorreta,
  };
}

const QUESTOES_PORTUGUES: Questao[] = [
  { pergunta: "Qual figura de linguagem está presente em 'A vida vem em ondas'?", alternativas: ["Metáfora", "Hipérbole", "Eufemismo", "Ironia"], correta: 0 },
  { pergunta: "Na frase 'Compramos um carro novo', o sujeito é:", alternativas: ["Oculto (Nós)", "Indeterminado", "Simples (carro)", "Inexistente"], correta: 0 },
  { pergunta: "Assinale a alternativa em que a crase foi empregada corretamente.", alternativas: ["Fui à feira.", "Ele se referiu a ela.", "O prêmio foi dado a quem mereceu.", "Andou a cavalo."], correta: 0 },
  { pergunta: "Qual palavra é um hiato?", alternativas: ["Saúde", "Pai", "Mãe", "Queijo"], correta: 0 },
  { pergunta: "'Mal' com 'L' é o oposto de:", alternativas: ["Bem", "Bom", "Mau", "Ruim"], correta: 0 },
  { pergunta: "A palavra 'embora' é uma conjunção:", alternativas: ["Concessiva", "Adversativa", "Conclusiva", "Explicativa"], correta: 0 },
  { pergunta: "Qual o plural correto de 'cidadão'?", alternativas: ["Cidadãos", "Cidadões", "Cidadães", "Cidades"], correta: 0 },
  { pergunta: "Em 'Choveu muito ontem', temos uma oração:", alternativas: ["Sem sujeito", "Com sujeito oculto", "Com sujeito simples", "Com sujeito composto"], correta: 0 },
  { pergunta: "O verbo 'pôr' e seus derivados pertencem a qual conjugação?", alternativas: ["Segunda", "Primeira", "Terceira", "Quarta"], correta: 0 },
  { pergunta: "Qual das seguintes palavras é paroxítona?", alternativas: ["Caráter", "Café", "Ananás", "Lâmpada"], correta: 0 },
  { pergunta: "A concordância verbal está incorreta em:", alternativas: ["Fazem dois anos que não o vejo.", "Havia muitos problemas.", "Existe poucas soluções.", "Dez por cento da turma faltou."], correta: 2 },
  { pergunta: "A voz passiva analítica é formada por:", alternativas: ["Verbo ser/estar + particípio", "Pronome 'se'", "Verbo na forma infinitiva", "Gerúndio"], correta: 0 },
  { pergunta: "O pronome 'cujo' estabelece uma relação de:", alternativas: ["Posse", "Lugar", "Tempo", "Modo"], correta: 0 },
  { pergunta: "Qual o significado da expressão 'a priori'?", alternativas: ["Anterior à experiência", "Posterior à experiência", "Com certeza", "Em tese"], correta: 0 },
  { pergunta: "'Houve' é forma do verbo:", alternativas: ["Haver", "Houver", "Havir", "Haverer"], correta: 0 },
  { pergunta: "A palavra 'psicologia' tem um:", alternativas: ["Dígrafo", "Encontro consonantal", "Hiato", "Ditongo"], correta: 0 },
  { pergunta: "Qual função sintática de 'de madeira' em 'mesa de madeira'?", alternativas: ["Adjunto adnominal", "Adjunto adverbial", "Objeto indireto", "Complemento nominal"], correta: 0 },
  { pergunta: "O coletivo de 'lobos' é:", alternativas: ["Alcateia", "Manada", "Rebanho", "Cardume"], correta: 0 },
  { pergunta: "O antônimo de 'efêmero' é:", alternativas: ["Duradouro", "Rápido", "Frágil", "Belo"], correta: 0 },
  { pergunta: "Na frase 'Ele necessita de ajuda', o verbo é:", alternativas: ["Transitivo indireto", "Transitivo direto", "Intransitivo", "De ligação"], correta: 0 },
  { pergunta: "O termo 'outrem' é um pronome:", alternativas: ["Indefinido", "Pessoal", "Possessivo", "Demonstrativo"], correta: 0 },
  { pergunta: "'Se eu puser' está em que tempo e modo verbal?", alternativas: ["Futuro do Subjuntivo", "Presente do Indicativo", "Pretérito Imperfeito", "Futuro do Presente"], correta: 0 },
  { pergunta: "Qual a forma correta: 'para eu fazer' ou 'para mim fazer'?", alternativas: ["Para eu fazer", "Para mim fazer", "Ambas estão corretas", "Ambas estão incorretas"], correta: 0 },
  { pergunta: "Qual palavra NÃO é um substantivo abstrato?", alternativas: ["Caneta", "Saudade", "Beleza", "Amor"], correta: 0 },
  { pergunta: "O uso da vírgula está incorreto em:", alternativas: ["João, o padeiro, chegou.", "Comprei pão, queijo e presunto.", "O aluno, estuda para a prova.", "Rio de Janeiro, 15 de julho de 2025."], correta: 2 }
].map(shuffleAlternativas);

const QUESTOES_MATEMATICA: Questao[] = [
  { pergunta: "Qual é o valor de 25% de 200?", alternativas: ["50", "25", "75", "100"], correta: 0 },
  { pergunta: "Se um produto custa R$ 80,00 e tem um desconto de 10%, qual o novo preço?", alternativas: ["R$ 72,00", "R$ 70,00", "R$ 8,00", "R$ 60,00"], correta: 0 },
  { pergunta: "A soma dos ângulos internos de um triângulo é sempre:", alternativas: ["180°", "360°", "90°", "270°"], correta: 0 },
  { pergunta: "Qual o próximo número na sequência 2, 4, 8, 16, ...?", alternativas: ["32", "24", "20", "64"], correta: 0 },
  { pergunta: "Quanto é 15 x 4?", alternativas: ["60", "45", "50", "75"], correta: 0 },
  { pergunta: "Um quadrado com lado de 5 cm tem uma área de:", alternativas: ["25 cm²", "20 cm²", "10 cm²", "50 cm²"], correta: 0 },
  { pergunta: "Em uma razão de 1 para 5, se o menor número é 10, qual é o maior?", alternativas: ["50", "25", "60", "15"], correta: 0 },
  { pergunta: "Qual o resultado de (10 + 5) * 2?", alternativas: ["30", "25", "20", "40"], correta: 0 },
  { pergunta: "Se 3 maçãs custam R$ 6,00, quanto custam 5 maçãs?", alternativas: ["R$ 10,00", "R$ 12,00", "R$ 15,00", "R$ 8,00"], correta: 0 },
  { pergunta: "Qual a raiz quadrada de 81?", alternativas: ["9", "8", "7", "10"], correta: 0 },
  { pergunta: "João tem 30 anos e Pedro tem a metade da idade de João. Quantos anos Pedro terá daqui a 10 anos?", alternativas: ["25 anos", "20 anos", "30 anos", "35 anos"], correta: 0 },
  { pergunta: "Se um evento tem 2/5 de chance de ocorrer, qual a chance de ele NÃO ocorrer?", alternativas: ["3/5", "2/5", "5/2", "1/5"], correta: 0 },
  { pergunta: "O valor de 2³ é:", alternativas: ["8", "6", "9", "16"], correta: 0 },
  { pergunta: "Qual o Mínimo Múltiplo Comum (MMC) entre 4 e 6?", alternativas: ["12", "24", "8", "2"], correta: 0 },
  { pergunta: "Um carro percorre 120 km em 2 horas. Qual sua velocidade média?", alternativas: ["60 km/h", "80 km/h", "100 km/h", "240 km/h"], correta: 0 },
  { pergunta: "Quantos minutos existem em 3,5 horas?", alternativas: ["210 minutos", "180 minutos", "195 minutos", "240 minutos"], correta: 0 },
  { pergunta: "Um círculo com raio de 10 cm tem um diâmetro de:", alternativas: ["20 cm", "10 cm", "31,4 cm", "5 cm"], correta: 0 },
  { pergunta: "O resultado de 50 - (5 * 6) é:", alternativas: ["20", "270", "40", "25"], correta: 0 },
  { pergunta: "Em um grupo de 40 pessoas, 75% são mulheres. Quantos homens há no grupo?", alternativas: ["10", "30", "25", "15"], correta: 0 },
  { pergunta: "Qual fração é equivalente a 0,5?", alternativas: ["1/2", "1/5", "5/1", "1/4"], correta: 0 },
  { pergunta: "Se x + 10 = 15, qual o valor de x?", alternativas: ["5", "10", "15", "25"], correta: 0 },
  { pergunta: "Qual é o perímetro de um retângulo com lados de 4m e 6m?", alternativas: ["20m", "24m", "10m", "16m"], correta: 0 },
  { pergunta: "Convertendo 3000 metros para quilômetros, temos:", alternativas: ["3 km", "30 km", "0,3 km", "300 km"], correta: 0 },
  { pergunta: "Qual é o dobro de 1/4?", alternativas: ["1/2", "1/8", "2/4", "1"], correta: 0 },
  { pergunta: "Se uma caixa tem 12 ovos, quantas caixas são necessárias para 60 ovos?", alternativas: ["5", "6", "4", "10"], correta: 0 }
].map(shuffleAlternativas);

function shuffleArray<T>(array: T[]): T[] {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

const getRandomQuestions = (): Questao[] => {
  const portugues = shuffleArray(QUESTOES_PORTUGUES).slice(0, 3);
  const matematica = shuffleArray(QUESTOES_MATEMATICA).slice(0, 3);
  return shuffleArray([...portugues, ...matematica]);
};

const MinigameModal: React.FC<MinigameModalProps> = ({ isOpen, onClose }) => {
  const [questions, setQuestions] = useState<Questao[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timer, setTimer] = useState(90);
  const [intervalId, setIntervalId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setQuestions(getRandomQuestions());
      setCurrent(0);
      setScore(0);
      setSelected(null);
      setShowResult(false);
      setTimer(90);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || showResult) return;
    if (timer === 0) {
      setShowResult(true);
      return;
    }
    const id = window.setInterval(() => setTimer(t => t - 1), 1000);
    setIntervalId(id);
    return () => clearInterval(id);
  }, [isOpen, timer, showResult]);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = questions[current].correta;
    if (idx === correct) setScore(s => s + 1);
    setTimeout(() => {
      if (current === questions.length - 1) {
        setShowResult(true);
        if (intervalId) clearInterval(intervalId);
      } else {
        setCurrent(c => c + 1);
        setSelected(null);
      }
    }, 1000);
  };

  const handleRestart = () => {
    setQuestions(getRandomQuestions());
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setTimer(90);
  };

  if (!isOpen) return null;

  return (
    <div className="minigame-modal-overlay">
      <div className="minigame-modal">
        <button className="minigame-close" onClick={onClose}>×</button>
        <br />
        <h2 className="minigame-title">Gabaritando Contra o Relógio</h2>
        <div className="minigame-timer">⏰ {timer}s</div>
        {!showResult ? (
          <>
            <div className="minigame-question">
              <span>Pergunta {current + 1} de {questions.length}</span>
              <p>{questions[current]?.pergunta}</p>
            </div>
            <div className="minigame-options">
              {questions[current]?.alternativas.map((alt, idx) => {
                let className = 'minigame-option';
                if (selected !== null) {
                  if (idx === questions[current].correta) className += ' correct';
                  else if (idx === selected) className += ' wrong';
                }
                return (
                  <button
                    key={idx}
                    className={className}
                    onClick={() => handleSelect(idx)}
                    disabled={selected !== null}
                  >
                    {alt}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div className="minigame-result">
            <h3>Desafio Concluído!</h3>
            <p>Você acertou <span className="minigame-score">{score}</span> de {questions.length} questões!</p>
            <div className="minigame-result-actions">
              <button onClick={handleRestart} className="minigame-restart">Jogar Novamente</button>
              <button onClick={onClose} className="minigame-close-btn">Fechar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MinigameModal; 