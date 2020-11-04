import React, { useEffect, useState, Fragment } from "react";
import Web3 from "web3";
import Navbar from "./Navbar";
// const EthereumTx = require("ethereumjs-tx").Transaction;
import Body from "./Body";
import ContractDetails from "./contractsDetails/ContractDetails.json";
import KovanContractdetailsjson from "./contractsDetails/KovanContractDetails.json";
import MainContractDetails from "./contractsDetails/MainContractDetails.json";
import ContractDeployment from "./ContractDeployment";
import Admin from "./Admin";
// import { BigInt } from "BigInt";
// import "BigInt";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Redirect,
  // useHistory,
} from "react-router-dom";

const App = () => {
  const [refresh, setrefresh] = useState(0);

  let content;

  const [loading2, setloading2] = useState(false);

  const [account, setAccount] = useState("");
  const [CashSymbol, setCashSymbol] = useState("");
  const [loading, setLoading] = useState(true);
  const [CashBoxV2, setCashBoxV2] = useState();
  const [cashDecimals, setCashDecimals] = useState();
  const [assetDecimals, setAssetDecimals] = useState();
  const [AssetPoolDecimals, setAssetPoolDecimals] = useState(0);

  const [cashsc, setcashsc] = useState();
  const [assettokensc, setassettokensc] = useState();
  const [assetpooltokensc, setassetpooltokensc] = useState();

  const [pooltokenTotalSupply, setpooltokenTotalSupply] = useState(0);
  const [contractassetTokenBalance, setcontractassetTokenBalance] = useState(0);
  const [contractCashBalance, setcontractCashBalance] = useState(0);
  const [contractCashValuation, setcontractCashValuation] = useState(0);
  // const [stockTokenAddress, setstockTokenAddress] = useState("");
  // const [stockPoolTokenAddress, setstockPoolTokenAddress] = useState("");
  const [dcashValauationCap, setdcashValauationCap] = useState();
  const [urlll, seturll] = useState();
  const [data, setdata] = useState({
    url: "",
    cashcap: 0,
  });
  const [myassetbalance, setmyassetbalance] = useState(0);
  const [mypoolbalance, setmypoolbalance] = useState(0);
  const [mycashbalance, setmycashbalance] = useState(0);
  const [myassetpooltokenbalance, setmyassetpooltokenbalance] = useState(0);
  const [pooltocash, setpooltocash] = useState(0);
  const [assettocash, setassettocash] = useState(0);
  const [contract, setContract] = useState({});

  const [CashV2address, setCashV2address] = useState("");
  const [AssetTokenaddress, setAssetTokenaddress] = useState("");
  const [TokenAddress, setTokenAdress] = useState("");
  const [AssetPoolTokenaddress, setAssetPoolTokenaddress] = useState("");
  const [CashV2Cashallowance, setCashV2Cashallowance] = useState("");

  const [Cashv2assetallowance, setCashv2assetallowance] = useState("");

  const [decimalexactvalue, setdecimalexactvalue] = useState("");

  const [Cashv2allowances, setCashv2allowances] = useState("");

  const [getNetwork, setNetwork] = useState("");
  const [getNetworkEtherscanURL, setNetworkEtherscanURL] = useState("");

  const loadWeb3 = async () => {
    try {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        window.alert(
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );

        setLoading(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const loadBlockchainData = async () => {
    setLoading(true);
    if (
      typeof window.ethereum == "undefined" ||
      typeof window.web3 == "undefined"
    ) {
      return;
    }
    const web3 = window.web3;

    let url = window.location.href;
    console.log(url);

    const accounts = await web3.eth.getAccounts();
    console.log(accounts.length);

    if (accounts.length == 0) {
      return;
    }

    setAccount(accounts[0]);
    const networkId = await web3.eth.net.getId();

    if (networkId === 1) {
      const contract = new web3.eth.Contract(
        MainContractDetails.stockLiquidatorABI
      );
      setContract(contract);

      setNetwork("Main Net");
      setNetworkEtherscanURL("https://etherscan.io/address/");
      console.log(getNetwork);

      const Stock = new web3.eth.Contract(
        MainContractDetails.stockLiquidatorABI,
        MainContractDetails.MainstockLiquidatorAddress
      );
      const allowances = await Stock.methods
        .allowance(accounts[0], MainContractDetails.MainstockLiquidatorAddress)
        .call()
        .then((result) => {
          console.log(result + " stock liqui allowances");
          setCashv2allowances(result);
        });

      const cashtoken = new web3.eth.Contract(
        MainContractDetails.ERC20ABI,
        MainContractDetails.MaincashAddress
      );
      const cashallowances = await cashtoken.methods
        .allowance(accounts[0], MainContractDetails.MainstockLiquidatorAddress)
        .call()
        .then((result) => {
          setCashV2Cashallowance(result);
        });

      setcashsc(cashtoken);
      const assettoken = new web3.eth.Contract(
        MainContractDetails.ERC20ABI,
        MainContractDetails.MainstockTokenAddress
      );
      const stockallowances = await assettoken.methods
        .allowance(accounts[0], MainContractDetails.MainstockLiquidatorAddress)
        .call()
        .then((result) => {
          setCashv2assetallowance(result);
        });
      setassettokensc(assettoken);
      // const assetpooltoken = new web3.eth.Contract(
      //   ContractDetails.ERC20ABI,
      //   ContractDetails.stockPoolTokenAddress
      // );
      // setassetpooltokensc(assetpooltoken);
      setCashBoxV2(Stock);

      setCashV2address(MainContractDetails.MainstockLiquidatorAddress);
      setAssetTokenaddress(MainContractDetails.MainstockTokenAddress);
      setTokenAdress(MainContractDetails.MaincashAddress);

      ///// have to add name ticker
      let cashsymbol = await cashtoken.methods.symbol().call();
      setCashSymbol(cashsymbol);
      let cashDecimals = await Stock.methods.cashDecimals().call();
      let assetDecimals = await assettoken.methods.decimals().call();
      setCashDecimals(cashDecimals);
      setAssetDecimals(assetDecimals);

      const cashbalance = await cashtoken.methods.balanceOf(accounts[0]).call();
      let cashbalanceupdate = await (cashbalance / 10 ** cashDecimals);

      setmycashbalance(cashbalanceupdate);
      const pooltokenbalance = await Stock.methods
        .balanceOf(accounts[0])
        .call();
      let pooltokenbalanceupdate = await web3.utils.fromWei(pooltokenbalance);

      setmypoolbalance(pooltokenbalanceupdate);

      const assetbalance = await assettoken.methods
        .balanceOf(accounts[0])
        .call();
      let assetbalanceupdate = await (assetbalance / 10 ** assetDecimals);
      setmyassetbalance(assetbalanceupdate);

      let cashvalauationcap = await Stock.methods.cashValauationCap().call();
      let updatedonecashcap = await (cashvalauationcap / 10 ** cashDecimals);
      setdcashValauationCap(updatedonecashcap);

      let geturl = await Stock.methods.url().call();
      seturll(geturl);
      // await setdata({
      //   url: geturl.toString(),
      //   cashcap: cashvalauationcap,
      // });

      const poolTokenTotalSupply = await Stock.methods
        .totalSupply()
        .call()
        .then(function (result) {
          let updatedone = web3.utils.fromWei(result);
          setpooltokenTotalSupply(updatedone);
        });
      const contractAssetTokenBalance = await Stock.methods
        .contractAssetTokenBalance()
        .call()
        .then(function (result) {
          let updatedone = result / 10 ** assetDecimals;
          setcontractassetTokenBalance(updatedone);
        });
      const contractCashBalance = await Stock.methods
        .contractCashBalance()
        .call()
        .then(function (result) {
          let updatedone = result / 10 ** cashDecimals;
          setcontractCashBalance(updatedone);
        });
      const contractCashValuation = await Stock.methods
        .contractCashValuation()
        .call()
        .then(function (result) {
          let updatedone = result / 10 ** cashDecimals;
          setcontractCashValuation(updatedone);
        });

      // const pooltocashupdate = Stock.methods
      //   .poolToCashRate()
      //   .call()
      //   .then(function (result) {
      //     setpooltocash(result);
      //   });

      const assettocashrate = Stock.methods
        .assetToCashRate()
        .call()
        .then(async function (result) {
          let updatedone = result / 10 ** cashDecimals;
          setassettocash(updatedone);
        });
      var a = "5000";
      let valueWei = window.web3.utils.toWei(a).toString();

      var b = parseInt(cashDecimals);
      let c, d;
      if (b < 18) {
        d = 18 - b;
        d = 10 ** d;
        valueWei = parseInt(valueWei) / d;
      }
      valueWei = valueWei.toString();
      console.log(valueWei);
      setdecimalexactvalue(valueWei);
      // console.log(geturl);
      // console.log(poolTokenTotalSupply);
      // console.log(contractStockTokenBalance);
      // console.log(contractCashBalance);
      // // console.log(stockTokenRate);
      // console.log(StockTokenAddress);
      // console.log(StockPoolTokenAddress);

      // const a = await fetch("https://oracleprov.herokuapp.com/get")
      //   .then((response) => response.json())
      //   .then((data) => console.log(data));

      setLoading(false);
    } else if (networkId === 42) {
      const contract = new web3.eth.Contract(
        ContractDetails.stockLiquidatorABI
      );
      setContract(contract);

      setNetwork("Kovan");
      setNetworkEtherscanURL("https://kovan.etherscan.io/address/");
      console.log(getNetwork);
      console.log(getNetworkEtherscanURL);

      const Cashboxv2 = new web3.eth.Contract(
        KovanContractdetailsjson.CashBoxv2ABI,
        KovanContractdetailsjson.CashBoxV2Address
      );

      const allowances = await Cashboxv2.methods
        .allowance(accounts[0], KovanContractdetailsjson.CashBoxV2Address)
        .call()
        .then((result) => {
          console.log("cash result " + result);
          setCashv2allowances(result);
        });

      const cashtoken = new web3.eth.Contract(
        KovanContractdetailsjson.ERC20ABI,
        KovanContractdetailsjson.cashAddress
      );
      const cashallowances = await cashtoken.methods
        .allowance(accounts[0], KovanContractdetailsjson.CashBoxV2Address)
        .call()
        .then((result) => {
          console.log("cash result " + result);
          setCashV2Cashallowance(result);
        });
      setcashsc(cashtoken);
      const assettoken = new web3.eth.Contract(
        KovanContractdetailsjson.ERC20ABI,
        KovanContractdetailsjson.AssetTokenAddress
      );

      const Assetallowances = await assettoken.methods
        .allowance(accounts[0], KovanContractdetailsjson.CashBoxV2Address)
        .call()
        .then((result) => {
          console.log("stock result " + result);
          setCashv2assetallowance(result);
        });

      setassettokensc(assettoken);
      const assetpooltoken = new web3.eth.Contract(
        KovanContractdetailsjson.ERC20ABI,
        KovanContractdetailsjson.AssetPoolTokenAddress
      );

      setassetpooltokensc(assetpooltoken);
      setCashBoxV2(Cashboxv2);
      setCashV2address(KovanContractdetailsjson.CashBoxV2Address);
      setAssetTokenaddress(KovanContractdetailsjson.AssetTokenAddress);
      setTokenAdress(KovanContractdetailsjson.cashAddress);
      setAssetPoolTokenaddress(KovanContractdetailsjson.AssetPoolTokenAddress);

      ///// have to add name ticker
      let cashsymbol = await cashtoken.methods.symbol().call();
      setCashSymbol(cashsymbol);
      let cashDecimals = await Cashboxv2.methods.cashDecimals().call();
      let assetDecimals = await assettoken.methods.decimals().call();
      let assetpoolDecimals = await assetpooltoken.methods.decimals().call();
      setCashDecimals(cashDecimals);
      setAssetDecimals(assetDecimals);
      setAssetPoolDecimals(assetpoolDecimals);

      const cashbalance = await cashtoken.methods.balanceOf(accounts[0]).call();
      let cashbalanceupdate = await (cashbalance / 10 ** cashDecimals);

      setmycashbalance(cashbalanceupdate);

      const assetpooltkbalance = await assetpooltoken.methods
        .balanceOf(accounts[0])
        .call();
      console.log("asset pool " + assetpooltkbalance);
      let assetpooltokenbalanceupdate = await (assetpooltkbalance /
        10 ** assetpoolDecimals);
      setmyassetpooltokenbalance(assetpooltokenbalanceupdate);

      const pooltokenbalance = await Cashboxv2.methods
        .balanceOf(accounts[0])
        .call();
      let pooltokenbalanceupdate = await web3.utils.fromWei(pooltokenbalance);

      setmypoolbalance(pooltokenbalanceupdate);

      const assetbalance = await assettoken.methods
        .balanceOf(accounts[0])
        .call();
      let assetbalanceupdate = await (assetbalance / 10 ** assetDecimals);
      setmyassetbalance(assetbalanceupdate);
      let cashvalauationcap = await Cashboxv2.methods
        .cashValauationCap()
        .call();
      let updatedonecashcap = await (cashvalauationcap / 10 ** cashDecimals);
      setdcashValauationCap(updatedonecashcap);

      let geturl = await Cashboxv2.methods.url().call();
      seturll(geturl);
      // await setdata({
      //   url: geturl.toString(),
      //   cashcap: cashvalauationcap,
      // });

      const poolTokenTotalSupply = await Cashboxv2.methods
        .totalSupply()
        .call()
        .then(function (result) {
          let updatedone = web3.utils.fromWei(result);
          setpooltokenTotalSupply(updatedone);
        });
      const contractStockTokenBalance = await Cashboxv2.methods
        .contractAssetTokenBalance()
        .call()
        .then(function (result) {
          let updatedone = result / 10 ** assetDecimals;
          setcontractassetTokenBalance(updatedone);
        });
      const contractCashBalance = await Cashboxv2.methods
        .contractCashBalance()
        .call()
        .then(function (result) {
          let updatedone = result / 10 ** cashDecimals;
          setcontractCashBalance(updatedone);
        });
      const contractCashValuation = await Cashboxv2.methods
        .contractCashValuation()
        .call()
        .then(function (result) {
          let updatedone = result / 10 ** cashDecimals;
          setcontractCashValuation(updatedone);
        });

      // const pooltocashupdate = Stock.methods
      //   .poolToCashRate()
      //   .call()
      //   .then(function (result) {
      //     setpooltocash(result);
      //   });

      const assettocashupdate = Cashboxv2.methods
        .assetToCashRate()
        .call()
        .then(async function (result) {
          let updatedone = result / 10 ** cashDecimals;
          setassettocash(updatedone);
        });
      var a = "5000";
      let valueWei = window.web3.utils.toWei(a).toString();

      var b = parseInt(cashDecimals);
      let c, d;
      if (b < 18) {
        d = 18 - b;
        d = 10 ** d;
        valueWei = parseInt(valueWei) / d;
      }
      valueWei = valueWei.toString();
      console.log(valueWei);
      setdecimalexactvalue(valueWei);

      // console.log(geturl);
      // console.log(poolTokenTotalSupply);
      // console.log(contractStockTokenBalance);
      // console.log(contractCashBalance);
      // // console.log(stockTokenRate);
      // console.log(StockTokenAddress);
      // console.log(StockPoolTokenAddress);

      // const a = await fetch("https://oracleprov.herokuapp.com/get")
      //   .then((response) => response.json())
      //   .then((data) => console.log(data));

      setLoading(false);
    } else {
      window.alert("the contract not deployed to detected network.");
      setloading2(true);
    }
  };

  const onsubmitdetails = async (
    cashaddress,
    stockTokenAddress,
    UppercapLimit,
    tokenname,
    tokensymbol,
    URl
  ) => {
    const web3 = window.web3;
    let bytecode = MainContractDetails.stockLiquidatorBytecode;

    const uppercapinwei = UppercapLimit * 10 ** cashDecimals;
    let payload = {
      data: bytecode,
      arguments: [
        cashaddress,
        stockTokenAddress,
        uppercapinwei,
        tokenname,
        tokensymbol,
        URl,
      ],
    };

    let parameter = {
      from: account,
      gas: web3.utils.toHex(800000),
      gasPrice: web3.utils.toHex(web3.utils.toWei("30", "gwei")),
    };
    await contract
      .deploy(payload)
      .send(parameter, (err, transactionHash) => {
        console.log("Transaction Hash :", transactionHash);
      })
      .on("confirmation", () => {})
      .then((newContractInstance) => {
        console.log(
          "Deployed Contract Address : ",
          newContractInstance.options.address
        );
      });
  };

  const InfiniteApprovalCash = async () => {
    var a = "1000000";
    let valueWei = window.web3.utils.toWei(a).toString();

    var b = parseInt(cashDecimals);
    let c, d;
    if (b < 18) {
      d = 18 - b;
      d = 10 ** d;
      valueWei = parseInt(valueWei) / d;
    }

    console.log(valueWei, b, c, d);
    valueWei = valueWei.toString();
    await cashsc.methods
      .approve(CashV2address, valueWei)
      .send({ from: account })
      .once("receipt", async (receipt) => {
        setrefresh(1);
      })
      .on("error", (error) => {
        setrefresh(1);
      });
  };

  const InfiniteApprovalAsset = async () => {
    var a = "1000000";
    let valueWei = window.web3.utils.toWei(a).toString();

    var b = parseInt(cashDecimals);
    let c, d;
    if (b < 18) {
      d = 18 - b;
      d = 10 ** d;
      valueWei = parseInt(valueWei) / d;
    }

    console.log(valueWei, b, c, d);
    valueWei = valueWei.toString();
    await assettokensc.methods
      .approve(CashV2address, valueWei)
      .send({ from: account })
      .once("receipt", async (receipt) => {
        setrefresh(1);
      })
      .on("error", (error) => {
        setrefresh(1);
      });
  };

  const InfiniteApprovalCashV2 = async () => {
    var a = "1000000";
    let valueWei = window.web3.utils.toWei(a).toString();

    var b = parseInt(cashDecimals);
    let c, d;
    if (b < 18) {
      d = 18 - b;
      d = 10 ** d;
      valueWei = parseInt(valueWei) / d;
    }

    console.log(valueWei, b, c, d);
    valueWei = valueWei.toString();
    await CashBoxV2.methods
      .approve(KovanContractdetailsjson.CashBoxV2Address, valueWei)
      .send({ from: account })
      .once("receipt", async (receipt) => {
        setrefresh(1);
      })
      .on("error", (error) => {
        setrefresh(1);
      });
  };

  const redeemStockToken = async (a) => {
    let valueWei = window.web3.utils.toWei(a).toString();

    var b = parseInt(cashDecimals);
    let c, d;
    if (b < 18) {
      d = 18 - b;
      d = 10 ** d;
      valueWei = parseInt(valueWei) / d;
    }

    console.log(valueWei, b, c, d);
    valueWei = valueWei.toString();
    if (parseInt(Cashv2assetallowance) >= parseInt(valueWei)) {
    } else {
      await assettokensc.methods
        .approve(CashV2address, valueWei)
        .send({ from: account })
        .once("receipt", async (receipt) => {
          setLoading(false);
        })
        .on("error", (error) => {
          setrefresh(1);
        });
    }

    await CashBoxV2.methods
      .redeemStockToken(valueWei)
      .send({ from: account })
      .once("receipt", async (receipt) => {
        setLoading(false);
        setrefresh(1);
      })
      .on("error", (error) => {
        setrefresh(1);
      });
  };

  const mintPoolToken = async (a) => {
    let valueWei = window.web3.utils.toWei(a).toString();

    var b = parseInt(cashDecimals);
    let c, d;
    if (b < 18) {
      d = 18 - b;
      d = 10 ** d;
      valueWei = parseInt(valueWei) / d;
    }

    console.log(valueWei, b, c, d);
    valueWei = valueWei.toString();
    if (parseInt(CashV2Cashallowance) >= parseInt(valueWei)) {
    } else {
      await cashsc.methods
        .approve(CashV2address, valueWei)
        .send({ from: account })
        .once("receipt", async (receipt) => {})
        .on("error", (error) => {
          setrefresh(1);
        });
    }

    await CashBoxV2.methods
      .mintPoolToken(valueWei)
      .send({ from: account })
      .once("receipt", async (receipt) => {
        setLoading(false);
        setrefresh(1);
        setrefresh(1);
      })
      .on("error", (error) => {
        setrefresh(1);
      });
  };

  const burnPoolToken = async (a) => {
    let valueWei = window.web3.utils.toWei(a).toString();

    var b = parseInt(cashDecimals);
    let c, d;
    if (b < 18) {
      d = 18 - b;
      d = 10 ** d;
      valueWei = parseInt(valueWei) / d;
    }

    console.log(valueWei, b, c, d);
    valueWei = valueWei.toString();
    console.log(a);
    console.log(CashV2address);
    if (parseInt(Cashv2allowances) >= parseInt(valueWei)) {
    } else {
      await CashBoxV2.methods
        .approve(KovanContractdetailsjson.CashBoxV2Address, valueWei)
        .send({ from: account })
        .once("receipt", async (receipt) => {})
        .on("error", (error) => {
          setrefresh(1);
        });
    }

    await CashBoxV2.methods
      .burnPoolToken(valueWei)
      .send({ from: account })
      .once("receipt", async (receipt) => {
        setLoading(false);
        setrefresh(1);
      })
      .on("error", (error) => {
        setrefresh(1);
      });
  };

  const depositdai = async (a) => {
    let valueWei = window.web3.utils.toWei(a).toString();

    var b = parseInt(cashDecimals);
    let c, d;
    if (b < 18) {
      d = 18 - b;
      d = 10 ** d;
      valueWei = parseInt(valueWei) / d;
    }

    console.log(valueWei, b, c, d);
    valueWei = valueWei.toString();
    console.log(a);
    console.log(CashV2address);
    if (parseInt(Cashv2allowances) >= parseInt(valueWei)) {
    } else {
      await cashsc.methods
        .approve(KovanContractdetailsjson.CashBoxV2Address, valueWei)
        .send({ from: account })
        .once("receipt", async (receipt) => {})
        .on("error", (error) => {
          setrefresh(1);
        });
    }

    await CashBoxV2.methods
      .depositCash(valueWei)
      .send({ from: account })
      .once("receipt", async (receipt) => {
        setLoading(false);
        setrefresh(1);
      })
      .on("error", (error) => {
        setrefresh(1);
      });
  };

  const burnCashboxPoolTokenfunction = async (a) => {
    let valueWei = window.web3.utils.toWei(a).toString();

    var b = parseInt(cashDecimals);
    let c, d;
    if (b < 18) {
      d = 18 - b;
      d = 10 ** d;
      valueWei = parseInt(valueWei) / d;
    }

    console.log(valueWei, b, c, d);
    valueWei = valueWei.toString();
    console.log(a);
    console.log(CashV2address);

    await CashBoxV2.methods
      .burnCashboxPoolToken(valueWei)
      .send({ from: account })
      .once("receipt", async (receipt) => {
        setLoading(false);
        setrefresh(1);
      })
      .on("error", (error) => {
        setrefresh(1);
      });
  };

  const depositAssetfunction = async (a) => {
    let valueWei = window.web3.utils.toWei(a).toString();

    var b = parseInt(cashDecimals);
    let c, d;
    if (b < 18) {
      d = 18 - b;
      d = 10 ** d;
      valueWei = parseInt(valueWei) / d;
    }

    console.log(valueWei, b, c, d);
    valueWei = valueWei.toString();
    console.log(a);
    console.log(CashV2address);
    if (parseInt(Cashv2assetallowance) >= parseInt(valueWei)) {
    } else {
      await assettokensc.methods
        .approve(KovanContractdetailsjson.CashBoxV2Address, valueWei)
        .send({ from: account })
        .once("receipt", async (receipt) => {})
        .on("error", (error) => {
          setrefresh(1);
        });
    }

    await CashBoxV2.methods
      .depositAsset(valueWei)
      .send({ from: account })
      .once("receipt", async (receipt) => {
        setLoading(false);
        setrefresh(1);
      })
      .on("error", (error) => {
        setrefresh(1);
      });
  };

  const burnAssetPoolTokenfunction = async (a) => {
    let valueWei = window.web3.utils.toWei(a).toString();

    var b = parseInt(cashDecimals);
    let c, d;
    if (b < 18) {
      d = 18 - b;
      d = 10 ** d;
      valueWei = parseInt(valueWei) / d;
    }

    console.log(valueWei, b, c, d);
    valueWei = valueWei.toString();
    console.log(a);
    console.log(CashV2address);

    await CashBoxV2.methods
      .burnAssetPoolToken(valueWei)
      .send({ from: account })
      .once("receipt", async (receipt) => {
        setLoading(false);
        setrefresh(1);
      })
      .on("error", (error) => {
        setrefresh(1);
      });
  };

  const updateCashValuationCap = async (a) => {
    let valueWei = window.web3.utils.toWei(a).toString();

    var b = parseInt(cashDecimals);
    let c, d;
    if (b < 18) {
      d = 18 - b;
      d = 10 ** d;
      valueWei = parseInt(valueWei) / d;
    }

    console.log(valueWei, b, c, d);
    valueWei = valueWei.toString();
    await CashBoxV2.methods
      .updateCashValuationCap(valueWei)
      .send({ from: account })
      .once("receipt", async (receipt) => {
        setLoading(false);
        setrefresh(1);
      })
      .on("error", (error) => {
        setrefresh(1);
      });
  };

  const changeOwner = async (a) => {
    await CashBoxV2.methods
      .changeOwner(a.toString())
      .send({ from: account })
      .once("receipt", async (receipt) => {
        setLoading(false);
        setrefresh(1);
      })
      .on("error", (error) => {
        setrefresh(1);
      });
  };

  const updateurl = async (url) => {
    await CashBoxV2.methods
      .updateURL(url)
      .send({ from: account })
      .once("receipt", async (receipt) => {
        setLoading(false);
        setrefresh(1);
      })
      .on("error", (error) => {
        setrefresh(1);
      });
  };

  useEffect(() => {
    try {
      loadWeb3();
      loadBlockchainData();
    } catch (e) {
      return <div>Helllo</div>;
    }
    if (refresh == 1) {
      setrefresh(0);
      loadBlockchainData();
    }
    //esl
  }, [refresh]);

  if (loading === true) {
    content = (
      <p className="text-center">
        Loading ...
        {loading2 ? <div>load on mainnet </div> : ""}
      </p>
    );
  } else {
    content = (
      <div>
        <Router>
          <Switch>
            <Route
              exact
              path="/deploy"
              render={() => (
                <Fragment>
                  <ContractDeployment onsubmitdetails={onsubmitdetails} />
                </Fragment>
              )}
            />
            <Route
              path="/admin"
              render={() => (
                <Fragment>
                  <Admin
                    redeemStockToken={redeemStockToken}
                    mintPoolToken={mintPoolToken}
                    burnPoolToken={burnPoolToken}
                    updateCashValuationCap={updateCashValuationCap}
                    changeOwner={changeOwner}
                    pooltokenTotalSupply={pooltokenTotalSupply}
                    contractCashBalance={contractCashBalance}
                    contractassetTokenBalance={contractassetTokenBalance}
                    contractCashValuation={contractCashValuation}
                    mycashbalance={mycashbalance}
                    myassetbalance={myassetbalance}
                    mypoolbalance={mypoolbalance}
                    pooltocash={pooltocash}
                    assettocash={assettocash}
                    updateurl={updateurl}
                    dcashValauationCap={dcashValauationCap}
                    urlll={urlll}
                    getNetworkEtherscanURL={getNetworkEtherscanURL}
                  />
                </Fragment>
              )}
            />

            <Route
              path="/"
              render={() => (
                <Fragment>
                  <Body
                    redeemStockToken={redeemStockToken}
                    mintPoolToken={mintPoolToken}
                    burnPoolToken={burnPoolToken}
                    updateCashValuationCap={updateCashValuationCap}
                    changeOwner={changeOwner}
                    pooltokenTotalSupply={pooltokenTotalSupply}
                    contractCashBalance={contractCashBalance}
                    contractassetTokenBalance={contractassetTokenBalance}
                    contractCashValuation={contractCashValuation}
                    mycashbalance={mycashbalance}
                    myassetbalance={myassetbalance}
                    mypoolbalance={mypoolbalance}
                    pooltocash={pooltocash}
                    assettocash={assettocash}
                    updateurl={updateurl}
                    dcashValauationCap={dcashValauationCap}
                    urlll={urlll}
                    CashSymbol={CashSymbol}
                    InfiniteApprovalCash={InfiniteApprovalCash}
                    CashV2Cashallowance={CashV2Cashallowance}
                    Cashv2assetallowance={Cashv2assetallowance}
                    InfiniteApprovalAsset={InfiniteApprovalAsset}
                    Cashv2allowances={Cashv2allowances}
                    InfiniteApprovalCashV2={InfiniteApprovalCashV2}
                    decimalexactvalue={decimalexactvalue}
                    CashV2address={CashV2address}
                    AssetTokenaddress={AssetTokenaddress}
                    TokenAddress={TokenAddress}
                    getNetwork={getNetwork}
                    getNetworkEtherscanURL={getNetworkEtherscanURL}
                  />
                </Fragment>
              )}
            />
            <Route
              path="*"
              render={() => (
                <Fragment>
                  <Body
                    redeemStockToken={redeemStockToken}
                    mintPoolToken={mintPoolToken}
                    burnPoolToken={burnPoolToken}
                    updateCashValuationCap={updateCashValuationCap}
                    changeOwner={changeOwner}
                    pooltokenTotalSupply={pooltokenTotalSupply}
                    contractCashBalance={contractCashBalance}
                    contractassetTokenBalance={contractassetTokenBalance}
                    contractCashValuation={contractCashValuation}
                    mycashbalance={mycashbalance}
                    myassetbalance={myassetbalance}
                    mypoolbalance={mypoolbalance}
                    pooltocash={pooltocash}
                    assettocash={assettocash}
                    dcashValauationCap={dcashValauationCap}
                    urlll={urlll}
                    data={data}
                    CashSymbol={CashSymbol}
                    InfiniteApprovalCash={InfiniteApprovalCash}
                    CashV2Cashallowance={CashV2Cashallowance}
                    Cashv2assetallowance={Cashv2assetallowance}
                    InfiniteApprovalAsset={InfiniteApprovalAsset}
                    Cashv2allowances={Cashv2allowances}
                    InfiniteApprovalCashV2={InfiniteApprovalCashV2}
                    decimalexactvalue={decimalexactvalue}
                    CashV2address={CashV2address}
                    CashV2address={CashV2address}
                    AssetTokenaddress={AssetTokenaddress}
                    TokenAddress={TokenAddress}
                    getNetwork={getNetwork}
                    getNetworkEtherscanURL={getNetworkEtherscanURL}
                  />
                </Fragment>
              )}
            />
          </Switch>
        </Router>
      </div>
    );
  }

  return (
    <div>
      <Navbar account={account} getNetwork={getNetwork} />
      {loading === true ? (
        <p className="text-center">
          {account == "" ? (
            <div>
              {" "}
              Connect your wallet to application{"   "}{" "}
              {/* <div className="asset btn btn-grey-box" onClick={loadWeb3}>
                <span>Connect </span>
              </div>{" "} */}
            </div>
          ) : (
            "Loading ...."
          )}
        </p>
      ) : (
        <div>
          <Router>
            <Switch>
              <Route
                exact
                path="/deploy"
                render={() => (
                  <Fragment>
                    <ContractDeployment onsubmitdetails={onsubmitdetails} />
                  </Fragment>
                )}
              />
              <Route
                path="/admin"
                render={() => (
                  <Fragment>
                    <Admin
                      redeemStockToken={redeemStockToken}
                      mintPoolToken={mintPoolToken}
                      burnPoolToken={burnPoolToken}
                      updateCashValuationCap={updateCashValuationCap}
                      changeOwner={changeOwner}
                      pooltokenTotalSupply={pooltokenTotalSupply}
                      contractCashBalance={contractCashBalance}
                      contractassetTokenBalance={contractassetTokenBalance}
                      contractCashValuation={contractCashValuation}
                      mycashbalance={mycashbalance}
                      myassetbalance={myassetbalance}
                      mypoolbalance={mypoolbalance}
                      pooltocash={pooltocash}
                      assettocash={assettocash}
                      updateurl={updateurl}
                      dcashValauationCap={dcashValauationCap}
                      urlll={urlll}
                      CashV2address={CashV2address}
                      AssetTokenaddress={AssetTokenaddress}
                      TokenAddress={TokenAddress}
                      getNetwork={getNetwork}
                      getNetworkEtherscanURL={getNetworkEtherscanURL}
                    />
                  </Fragment>
                )}
              />

              <Route
                path="/"
                render={() => (
                  <Fragment>
                    <Body
                      redeemStockToken={redeemStockToken}
                      mintPoolToken={mintPoolToken}
                      burnPoolToken={burnPoolToken}
                      updateCashValuationCap={updateCashValuationCap}
                      changeOwner={changeOwner}
                      pooltokenTotalSupply={pooltokenTotalSupply}
                      contractCashBalance={contractCashBalance}
                      contractassetTokenBalance={contractassetTokenBalance}
                      contractCashValuation={contractCashValuation}
                      mycashbalance={mycashbalance}
                      myassetbalance={myassetbalance}
                      mypoolbalance={mypoolbalance}
                      pooltocash={pooltocash}
                      assettocash={assettocash}
                      updateurl={updateurl}
                      dcashValauationCap={dcashValauationCap}
                      urlll={urlll}
                      CashSymbol={CashSymbol}
                      InfiniteApprovalCash={InfiniteApprovalCash}
                      CashV2Cashallowance={CashV2Cashallowance}
                      Cashv2assetallowance={Cashv2assetallowance}
                      InfiniteApprovalAsset={InfiniteApprovalAsset}
                      Cashv2allowances={Cashv2allowances}
                      InfiniteApprovalCashV2={InfiniteApprovalCashV2}
                      decimalexactvalue={decimalexactvalue}
                      CashV2address={CashV2address}
                      AssetTokenaddress={AssetTokenaddress}
                      TokenAddress={TokenAddress}
                      getNetwork={getNetwork}
                      getNetworkEtherscanURL={getNetworkEtherscanURL}
                      AssetPoolTokenaddress={AssetPoolTokenaddress}
                      myassetpooltokenbalance={myassetpooltokenbalance}
                      depositdai={depositdai}
                      burnCashboxPoolTokenfunction={
                        burnCashboxPoolTokenfunction
                      }
                      depositAssetfunction={depositAssetfunction}
                      burnAssetPoolTokenfunction={burnAssetPoolTokenfunction}
                    />
                  </Fragment>
                )}
              />
              <Route
                path="*"
                render={() => (
                  <Fragment>
                    <Body
                      redeemStockToken={redeemStockToken}
                      mintPoolToken={mintPoolToken}
                      burnPoolToken={burnPoolToken}
                      updateCashValuationCap={updateCashValuationCap}
                      changeOwner={changeOwner}
                      pooltokenTotalSupply={pooltokenTotalSupply}
                      contractCashBalance={contractCashBalance}
                      contractassetTokenBalance={contractassetTokenBalance}
                      contractCashValuation={contractCashValuation}
                      mycashbalance={mycashbalance}
                      myassetbalance={myassetbalance}
                      mypoolbalance={mypoolbalance}
                      pooltocash={pooltocash}
                      assettocash={assettocash}
                      dcashValauationCap={dcashValauationCap}
                      urlll={urlll}
                      data={data}
                      CashSymbol={CashSymbol}
                      InfiniteApprovalCash={InfiniteApprovalCash}
                      CashV2Cashallowance={CashV2Cashallowance}
                      Cashv2assetallowance={Cashv2assetallowance}
                      InfiniteApprovalAsset={InfiniteApprovalAsset}
                      Cashv2allowances={Cashv2allowances}
                      InfiniteApprovalCashV2={InfiniteApprovalCashV2}
                      decimalexactvalue={decimalexactvalue}
                      CashV2address={CashV2address}
                      AssetTokenaddress={AssetTokenaddress}
                      TokenAddress={TokenAddress}
                      getNetwork={getNetwork}
                      getNetworkEtherscanURL={getNetworkEtherscanURL}
                    />
                  </Fragment>
                )}
              />
            </Switch>
          </Router>
        </div>
      )}
    </div>
  );
};

export default App;
