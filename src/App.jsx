import { useState, useEffect, useRef } from 'react'
import './App.css'

const SUCCESS_EMOJIS = ['🎉', '🌟', '⭐', '✨', '🎊', '🏆', '👏', '💫', '🎯', '🔥']
const CELEBRATION_EMOJIS = ['🎉', '🎊', '🌟', '⭐', '✨', '💫', '🎯', '🏆']

function App() {
  // État principal
  const [leftNumbers, setLeftNumbers] = useState(() => {
    const saved = localStorage.getItem('leftNumbers')
    return saved ? JSON.parse(saved) : [2, 3, 4, 5, 6, 7, 8, 9, 10]
  })
  const [rightNumbers, setRightNumbers] = useState(() => {
    const saved = localStorage.getItem('rightNumbers')
    return saved ? JSON.parse(saved) : [2, 3, 4, 5, 6, 7, 8, 9, 10]
  })
  const [score, setScore] = useState(() => {
    const saved = localStorage.getItem('score')
    return saved ? parseInt(saved) : 0
  })
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [recognizedText, setRecognizedText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [debugMode, setDebugMode] = useState(false)
  const [debugMessages, setDebugMessages] = useState([])
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallButton, setShowInstallButton] = useState(false)

  const recognitionRef = useRef(null)
  const inputRef = useRef(null)

  // Sauvegarde automatique
  useEffect(() => {
    localStorage.setItem('leftNumbers', JSON.stringify(leftNumbers))
    localStorage.setItem('rightNumbers', JSON.stringify(rightNumbers))
    localStorage.setItem('score', score.toString())
  }, [leftNumbers, rightNumbers, score])

  // PWA Installation
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallButton(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  // Reconnaissance vocale
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.lang = 'fr-FR'
      recognition.continuous = false
      recognition.interimResults = false

      recognition.onstart = () => {
        setIsListening(true)
        addDebugMessage('Reconnaissance vocale démarrée')
      }

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setRecognizedText(transcript)
        addDebugMessage(`Reconnu: "${transcript}"`)
        const number = parseSpokenNumber(transcript)
        if (number !== null) {
          setUserAnswer(number.toString())
          addDebugMessage(`Converti en nombre: ${number}`)
        } else {
          addDebugMessage(`Impossible de convertir "${transcript}" en nombre`)
        }
      }

      recognition.onerror = (event) => {
        setIsListening(false)
        addDebugMessage(`Erreur: ${event.error}`)
      }

      recognition.onend = () => {
        setIsListening(false)
        addDebugMessage('Reconnaissance vocale arrêtée')
      }

      recognitionRef.current = recognition
    }
  }, [])

  const addDebugMessage = (msg) => {
    setDebugMessages(prev => {
      const newMessages = [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]
      return newMessages.slice(-100) // Garder seulement les 100 derniers
    })
  }

  const parseSpokenNumber = (text) => {
    const cleanText = text.toLowerCase().trim()

    // Nombres de base
    const numbers = {
      'zéro': 0, 'un': 1, 'deux': 2, 'trois': 3, 'quatre': 4, 'cinq': 5,
      'six': 6, 'sept': 7, 'huit': 8, 'neuf': 9, 'dix': 10, 'onze': 11,
      'douze': 12, 'treize': 13, 'quatorze': 14, 'quinze': 15, 'seize': 16,
      'vingt': 20, 'trente': 30, 'quarante': 40, 'cinquante': 50,
      'soixante': 60, 'soixante-dix': 70, 'quatre-vingt': 80, 'quatre-vingts': 80,
      'quatre-vingt-dix': 90, 'cent': 100
    }

    // Vérifier si c'est un nombre direct
    if (numbers[cleanText] !== undefined) return numbers[cleanText]

    // Vérifier si c'est déjà un nombre
    const directNumber = parseInt(cleanText)
    if (!isNaN(directNumber)) return directNumber

    // Parser les nombres composés
    let total = 0
    const words = cleanText.split(/[\s-]+/)

    for (let i = 0; i < words.length; i++) {
      const word = words[i]
      if (numbers[word] !== undefined) {
        total += numbers[word]
      } else if (word === 'et' || word === 'le' || word === 'la') {
        continue
      } else {
        // Essayer de trouver une combinaison
        const combined = words.slice(i).join('-')
        if (numbers[combined] !== undefined) {
          total += numbers[combined]
          break
        }
      }
    }

    return total > 0 ? total : null
  }

  const generateQuestion = () => {
    if (leftNumbers.length === 0 || rightNumbers.length === 0) {
      alert('Veuillez sélectionner au moins un nombre pour chaque côté')
      return
    }
    const left = leftNumbers[Math.floor(Math.random() * leftNumbers.length)]
    const right = rightNumbers[Math.floor(Math.random() * rightNumbers.length)]
    setCurrentQuestion({ left, right, answer: left * right })
    setUserAnswer('')
    setRecognizedText('')
    setShowSuccess(false)
    setShowError(false)
    inputRef.current?.focus()
  }

  const checkAnswer = () => {
    if (!currentQuestion || userAnswer === '') return

    const answer = parseInt(userAnswer)
    if (answer === currentQuestion.answer) {
      setShowSuccess(true)
      setShowError(false)
      const newScore = score + 1
      setScore(newScore)

      if (newScore === 10) {
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 5000)
      }

      setTimeout(() => {
        setShowSuccess(false)
        generateQuestion()
      }, 1500)
    } else {
      setShowError(true)
      setTimeout(() => setShowError(false), 1000)
    }
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start()
    }
  }

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    setDeferredPrompt(null)
    setShowInstallButton(false)
  }

  const toggleNumber = (type, num) => {
    if (type === 'left') {
      setLeftNumbers(prev =>
        prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num].sort((a, b) => a - b)
      )
    } else {
      setRightNumbers(prev =>
        prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num].sort((a, b) => a - b)
      )
    }
  }

  const selectAll = (type) => {
    const all = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    if (type === 'left') setLeftNumbers(all)
    else setRightNumbers(all)
  }

  const selectNone = (type) => {
    if (type === 'left') setLeftNumbers([])
    else setRightNumbers([])
  }

  useEffect(() => {
    if (!currentQuestion) generateQuestion()
  }, [])

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && userAnswer) {
        checkAnswer()
      }
    }
    window.addEventListener('keypress', handleKeyPress)
    return () => window.removeEventListener('keypress', handleKeyPress)
  }, [userAnswer, currentQuestion])

  return (
    <div className="app">
      {showCelebration && (
        <div className="celebration">
          <div className="celebration-content">
            <h1>🎉 Félicitations ! 🎉</h1>
            <p>Tu as atteint 10 bonnes réponses !</p>
            <div className="emoji-rain">
              {Array.from({ length: 30 }).map((_, i) => (
                <span key={i} className="falling-emoji" style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}>
                  {CELEBRATION_EMOJIS[Math.floor(Math.random() * CELEBRATION_EMOJIS.length)]}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <header>
        <h1>✖️ Révise Tables</h1>
        <div className="header-buttons">
          {showInstallButton && (
            <button onClick={handleInstallClick} className="install-button">
              📥 Installer l'application
            </button>
          )}
          <button onClick={() => setShowSettings(!showSettings)} className="settings-button">
            ⚙️
          </button>
        </div>
      </header>

      {showSettings && (
        <div className="settings-panel">
          <h2>Paramètres</h2>

          <div className="settings-section">
            <h3>Nombres de gauche (multiplicande)</h3>
            <div className="button-group">
              <button onClick={() => selectAll('left')}>Tous</button>
              <button onClick={() => selectNone('left')}>Aucun</button>
            </div>
            <div className="number-grid">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(num => (
                <button
                  key={num}
                  onClick={() => toggleNumber('left', num)}
                  className={leftNumbers.includes(num) ? 'active' : ''}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="settings-section">
            <h3>Nombres de droite (multiplicateur)</h3>
            <div className="button-group">
              <button onClick={() => selectAll('right')}>Tous</button>
              <button onClick={() => selectNone('right')}>Aucun</button>
            </div>
            <div className="number-grid">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(num => (
                <button
                  key={num}
                  onClick={() => toggleNumber('right', num)}
                  className={rightNumbers.includes(num) ? 'active' : ''}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="settings-section">
            <label>
              <input
                type="checkbox"
                checked={debugMode}
                onChange={(e) => setDebugMode(e.target.checked)}
              />
              Mode debug (reconnaissance vocale)
            </label>
          </div>

          <button onClick={() => setShowSettings(false)} className="close-settings">
            Fermer
          </button>
        </div>
      )}

      <main>
        <div className="score">
          Score: {score} 🏆
        </div>

        {currentQuestion && (
          <div className="question-container">
            <div className="question">
              {currentQuestion.left} × {currentQuestion.right} = ?
            </div>

            <div className="answer-section">
              <input
                ref={inputRef}
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Ta réponse"
                className={showSuccess ? 'success' : showError ? 'error' : ''}
              />
              <button onClick={checkAnswer} disabled={!userAnswer}>
                Valider ✅
              </button>
              <button
                onClick={startListening}
                disabled={isListening || !recognitionRef.current}
                className="voice-button"
              >
                {isListening ? '🎤 Écoute...' : '🎤 Dicter'}
              </button>
            </div>

            {recognizedText && (
              <div className="recognized-text">
                Reconnu: "{recognizedText}"
              </div>
            )}

            {showSuccess && (
              <div className="feedback success-animation">
                ✅ Bravo ! {SUCCESS_EMOJIS[Math.floor(Math.random() * SUCCESS_EMOJIS.length)]}
              </div>
            )}

            {showError && (
              <div className="feedback error-animation">
                ❌ Essaie encore !
              </div>
            )}
          </div>
        )}

        <button onClick={generateQuestion} className="next-button">
          Question suivante ➡️
        </button>

        <button onClick={() => setScore(0)} className="reset-button">
          Réinitialiser le score
        </button>

        {debugMode && (
          <div className="debug-panel">
            <h3>Debug - Messages de reconnaissance vocale</h3>
            <div className="debug-messages">
              {debugMessages.slice().reverse().map((msg, i) => (
                <div key={i}>{msg}</div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
