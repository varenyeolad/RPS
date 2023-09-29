
import { useState } from 'react'
import { ethers } from 'ethers';

function App() {

  const [ userScore, setUserScore ] = useState(0)
  const [ computerScore, setcomputerScore ] = useState(0)
  

  // Подключаемся к контракту
const contractAddress = "0xB38A02d27b43d873964c069f619C1B972ff7e9a4"; //Замените вашим контрактом

// Указываем ABI (Application Binary Interface) контракта
const abi = 
[
  {
    "inputs": [],
    "stateMutability": "payable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isWinner",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "mssg",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "comp_choice",
        "type": "uint256"
      }
    ],
    "name": "GamePlayed",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "_option",
        "type": "uint8"
      }
    ],
    "name": "playWithSC",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
]

// Подключаемся к web3 провайдеру (метамаск)
const provider = new ethers.providers.Web3Provider(window.ethereum, 97);

let signer;
let contract;

//Запрашиваем аккаунты пользователя и подключаемся к первому аккаунту
provider.send("eth_requestAccounts", []).then(() => {
  provider.listAccounts().then((accounts) => {
    signer = provider.getSigner(accounts[0]);
    //Создаем объект контракта
    contract = new ethers.Contract(contractAddress, abi, signer);
    console.log(contract);
  });


});


// const playWithSC = async (playerChoice) => {
//   setIsWaiting(true);
//   try {
//       const transaction = await gameContract.connect(signer).play(playerChoice, {value: 100000000000000});
//       const receipt = await transaction.wait();
//       showGameResults(gameInterface.parseLog(receipt.logs[0]).args[0]);
//   } catch (ex) {
//       showGameResults(ex);
//   }
//   setIsWaiting(false);
// }



async function play(option) {
  const result = await contract.play(option);
  console.log(result); 
if(result) win();
else lose();
}


  function getComputerChoice() {
    let comp_res = fetchContractChoice();
    console.log(comp_res);
    return comp_res;
    
}

const fetchContractChoice = () => {
  fetch("https://api-testnet.bscscan.com/api?module=logs&action=getLogs&address=0xB38A02d27b43d873964c069f619C1B972ff7e9a4&topic0=0xfbc7c53d873a67f8e6275b295fefb21119d430c42d3365eaba52270417e0975e&apikey=QKCI5ZUE1ME49B59W92NC5PAAFDRX9QEYJ")
    .then(response => {
      return response.json()
    })
    .then(events => {
      const last = events.result.length;
      
      const stringDataOfLog = (String(events.result[last-1].data).slice(129, 130))
      console.log(stringDataOfLog);
      const choices = ['r', 'p', 's'];
      const randomNumber = stringDataOfLog;
      return choices[randomNumber]
    })
}

function win(userChoice, computerChoice) {
    setUserScore(userScore+1);
}


function lose(userChoice, computerChoice) {
    setcomputerScore(computerScore+1);
}


function draw(userChoice, computerChoice) {

}




function game(userChoice){
  const computerChoice = getComputerChoice();

  switch (userChoice + computerChoice){
      case 'rs':
      case 'pr':
      case 'sp':
          win(userChoice, computerChoice);
          break;


      case 'rp':
      case 'ps':
      case 'sr':
          lose(userChoice, computerChoice);
          break;


      case 'rr':
      case 'pp':
      case 'ss':
          draw(userChoice, computerChoice);
          break;
  }
}

  return (
    <>
      <div className='header'> 
        <h1>Rock Paper Scissors</h1> 
      </div> 

    <div className="score-board"> 
        <div id="user-label" className="badge">user</div>
        <div id="computer-label" className="badge">computer</div>
        <span id="user-score">{userScore}</span>:<span id="computer-score">{computerScore}</span>
    </div>

    <div className="result">
        <p>Paper covers rock. You win!</p>
    </div>
    
    <div className="choices">
        <div className="choice" id ='r' onClick={() => {game('r')}}>
            <img src="rock.png" width={200} height={350} alt=""/>
        </div>

        <div className="choice" id ='p' onClick={() => {game('p')}}>
            <img src="paper.png" width={200} height={350} alt=""/>
        </div>

        <div className="choice" id ='s' onClick={() => {game('s')}}>
            <img src="scissors.png" width={200} height={350} alt=""/>
        </div>

    </div>


    <p id="action-msg">Make your choice.</p>
    </>
  )
}

export default App
