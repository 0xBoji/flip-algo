import { useState, useEffect } from 'react'
import { PeraWalletConnect } from '@perawallet/connect'
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom'
import './App.css'
import token01 from './assets/token01.png'
import token02 from './assets/token02.png'
import './global.js'
import FlappyBird from './FlappyBird'

const peraWallet = new PeraWalletConnect()

function App() {
  const [result, setResult] = useState(null)
  const [accountAddress, setAccountAddress] = useState(null)

  useEffect(() => {
    peraWallet.reconnectSession().then((accounts) => {
      if (accounts.length) {
        setAccountAddress(accounts[0])
      }
    })

    peraWallet.connector?.on('disconnect', handleDisconnectWalletClick)

    return () => {
      peraWallet.connector?.off('disconnect', handleDisconnectWalletClick)
    }
  }, [])

  const handleConnectWalletClick = async () => {
    const newAccounts = await peraWallet.connect()
    setAccountAddress(newAccounts[0])
  }

  const handleDisconnectWalletClick = () => {
    peraWallet.disconnect()
    setAccountAddress(null)
  }

  const flipCoin = () => {
    const randomResult = Math.random() < 0.5 ? 'heads' : 'tails'
    setResult(randomResult)
    alert(`Transaction hash: https://testnet.explorer.perawallet.app/transactions/?transaction_list_address=3JOINWMWNSCQ5PMYW4ZMBLZMUBT4TU45KIOJRQEK3QAALDN6YJAHRYD2QA`)
  }

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Coin Flip</Link>
            </li>
            <li>
              <Link to="/flappybird">Flappy Bird</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={
            <>
              <h1>Coin Flip Game</h1>
              <div className="card">
                {accountAddress ? (
                  <>
                    <p>Connected: {accountAddress}</p>
                    <button onClick={handleDisconnectWalletClick}>Disconnect Wallet</button>
                    <button onClick={flipCoin}>Flip Coin</button>
                    {result && (
                      <div>
                        <p>Result:</p>
                        <img 
                          src={result === 'heads' ? token01 : token02} 
                          alt={result}
                          style={{ width: '100px', height: '100px' }}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <button onClick={handleConnectWalletClick}>Connect Wallet</button>
                )}
              </div>
              <p className="read-the-docs">
                Connect your wallet to play the coin flip game!
              </p>
            </>
          } />
          <Route path="/flappybird" element={<FlappyBird />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App