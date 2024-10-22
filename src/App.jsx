import { useState, useEffect } from 'react'
import { PeraWalletConnect } from '@perawallet/connect'
import './App.css'
import token01 from './assets/token01.png'
import token02 from './assets/token02.png'
import './global.js'

const peraWallet = new PeraWalletConnect()

function App() {
  const [result, setResult] = useState(null)
  const [accountAddress, setAccountAddress] = useState(null)

  useEffect(() => {
    // Reconnect to the session when the component is mounted
    peraWallet.reconnectSession().then((accounts) => {
      if (accounts.length) {
        setAccountAddress(accounts[0])
      }
    })

    // Handle disconnect event
    peraWallet.connector?.on('disconnect', handleDisconnectWalletClick)

    return () => {
      // Remove event listener on component unmount
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
  }

  return (
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
  )
}

export default App