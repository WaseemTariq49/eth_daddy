import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Search from './components/Search'
import Domain from './components/Domain'

// ABIs
import ETHDaddy from './abis/ETHDaddy.json'

// Config
import config from './config.json';

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);

  const [ethDaddy, setEthdaddy] = useState(null);
  const [domains, setDomains] = useState([]);

  // load account of metamask configured
  async function loadBlockchainData() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    // console.log(provider.getCode(0x5FbDB2315678afecb367f032d93F642f64180aa3))

    const network = await provider.getNetwork();
    console.log(network);

    const ethDaddy = new ethers.Contract(config[network.chainId].ETHDaddy.address, ETHDaddy, provider);
    setEthdaddy(ethDaddy)
    // console.log(ethDaddy)

    const maxSupply = await new ethDaddy.maxSupply();
    console.log(maxSupply.toString())

    let domain = [];
    for(let i=1; i<=maxSupply; i++){
      const domaine = await ethDaddy.getDomains(i);
      domain.push(domaine);
    }
    setDomains(domain);


    window.ethereum.on('accountsChanged', async()=>{
      const accounts = await window.ethereum.request({'method':'eth_requestAccounts'})
      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account)
    })
  }

  useEffect(() =>{
    loadBlockchainData()
  }, [Domain])

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
        <Search />
      <div className='cards__section'>
        <h2 className='cards__title'>Welcome to ETH Daddy</h2>
        <p className='cards__description'>
          Own your custom username, use it across services, and be able to store an avatar and other profile data.
        </p>
       
        <hr />

        <div className='cards'>
          {domains.map((domain, index) => (
            <Domain domain={domain} ethDaddy={ethDaddy} provider={provider} id={index + 1} key={index} />
          ))}
        </div> 
      </div>

    </div>
  );
}

export default App;