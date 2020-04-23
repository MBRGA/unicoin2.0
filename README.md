# UniCoin2.0

[![Netlify Status](https://api.netlify.com/api/v1/badges/63c88402-22eb-4298-9a5b-0f661833414b/deploy-status)](https://app.netlify.com/sites/unicoin-dapp/deploys)

UniCoin is a decentralized, smart contract based non-custodial research marketplace which empowers academics to benefit from commercially viable work. Companies can buy direct access to ideas they want to implement and are issued an NFT based licence which represents their access to the papers content. Papers are free for non-commercial usage. Research is always free for open-source and other research projects.

Unicoin began as a group project for the Mphil in Financial Technology at the University of Cape Town for the courses Fintech and Crypto Currencies and Financial Software Engineering and later formed the basis for a number of masters dissertations. The original repo can be found [here](https://github.com/unicoinlicences/unicoindapp).

The masters thesis accompanying this repository and all associated documentation can be found [here](./Documentation/Thesis.pdf). The other thesis, created by Luke Meiklejohn, can be found [here](https://github.com/lukemeiklejohn/HowToAttributeCredit).


# Documentation
This repo also contains a series of useful documents from the original unicoin project which are equally relevant for Unicoin2.0, including:

1) [Pitch deck 1](https://docs.google.com/presentation/d/121boHtItNj7PwzCdGhnDnEfL1r_Td9rAW86ny1Dp914/edit?usp=sharing)
2) [Pitch desk 2](https://drive.google.com/file/d/1d-NUUu8NgdDsqG7XaDggYe0KmbHDtW7n/view?usp=sharing)
3) [Business Plan](https://docs.google.com/document/d/1iGCbeWvZtk4chdc_CnT9JuZWNwgtNJcFvyyo_UosyZA/edit?usp=sharing)
4) [User story maps](https://app.cardboardit.com/maps/guests/e25edd87044ecad844f3397589800b193c2d41c9492854e0d9d80f7212d20c8d)

This monorepo contains all code for the UniCoin ecosystem. 
## Front End
Front end application can be run as outlined below:

### Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

## Smart contracts
This repo also contains smart contracts to facilitate auction listing, licence minting and account management. 

### compile contracts
```
truffle compile
```

### compile contracts
```
truffle compile
```

### test contracts
```
truffle test
```

### deploy contracts to rinkeby
```
truffle migrate --network rinkeby
```

### upgradable contract deployment
Unicoin's smart contracts were written to be upgradable using the Openzeppelin SDK. To deploy an upgradable version of the dapp run and then follow the consol prompts.
```
zos push
```

For more details on using ZOS and all associated functionality please see [here](https://github.com/OpenZeppelin/openzeppelin-sdk).

<img src="./src/assets/unicorn_running.gif">


