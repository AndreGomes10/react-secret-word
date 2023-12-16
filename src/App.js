// CSS
import './App.css';

// React
import { useCallback, useEffect, useState } from "react"

// data
import { wordsList } from "./data/word"

// Components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOverF from './components/GameOverF';



// o jogo vai ter 3 estagios
const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
]

const guessesQty = 3

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)

  const [pickWord, setPickWord] = useState("")  // palavra que vai ser escolhida
  const [pickedCategory, setPickCategory] = useState("")  // categoria que vai ser escolhida
  const [letters, setLetters] = useState([])  // uma lista de letras
  const [guessedLetters, setGuessedLetters] = useState([])  // letras adivinhadas
  const [wrongLetters, setWrongLetters] =  useState([])  // letras erradas
  const [guesses, setGuesses] = useState(guessesQty)  // as quantidade de tentativas do usuario
  const [score, setScore] = useState(50)  // pontuação do usuario conforme ele vai ganhando

  const pickWordAndCategory = useCallback(() => {
    // pick a random category
    const categories = Object.keys(words)  // vai pegar a chave do objeto
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]

    console.log(category)

    // pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    console.log(word)

    return {word, category}  // retornando como um objeto
  }, [words])

  // starts the secret word game
  const startGame = useCallback(() => {
    // clear all letters
    clearLetterStates()

    // pick word and pick category
    const {word, category} = pickWordAndCategory()

    // create an array of letters
    let wordletters = word.split("")  // criando um array de letras

    wordletters = wordletters.map((l) => l.toLowerCase())

    console.log(word, category)
    console.log(wordletters)

    // fill states, altera todos s estados
    setPickWord(word)
    setPickCategory(category)
    setLetters(wordletters)
    
    setGameStage(stages[1].name)
  }, [pickWordAndCategory])

  // process the letter input
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase()

    // check if letter has already been utilized
    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)){
      return
    }

    // push guessed letter or remove a guess
    if (letters.includes(normalizedLetter)) {
        setGuessedLetters((actualGuessedLetters) => [
          ...actualGuessedLetters,
          letter,
        ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  }

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  // check if guesses ended
  useEffect(() => {
    if(guesses <= 0){
      // reset all states
      clearLetterStates()
      
      setGameStage(stages[2].name)
    }
  }, [guesses, letters, startGame])

  // check win condition
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    // win condition
    if (guessedLetters.length === uniqueLetters.length) {
      // add score
      setScore((actualScore) => (actualScore += 100));

      // restart game with new word
      startGame();
    }
  }, [guessedLetters, letters, startGame])

  // starts the game
  const retry = () => {
    setScore(0)
    setGuesses(guessesQty)
    setGameStage(stages[0].name)
  }

  
  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame}/>}
      {gameStage === "game" && 
        <Game 
          verifyLetter={verifyLetter}
          pickWord={pickWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
          />
        }
      {gameStage === "end" && <GameOverF retry={retry} score={score}/>}
    </div>
  );
}

export default App;
