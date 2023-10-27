# graphic-representation-realt

The aim of this project is to synthesize data from the realt community api in graphical form.

Goal : learn react with this project

### Graphic :

- % by TYPE of home mono-family/Multy-family/SFR Portfolio
- % by country USA (see in state ?), Panama....
- % of portfolio by city (Detroit, Cleveland)
- % of portfolio in section 8, section 42, normal
- % of portfolio in dollas/Euros...

### How To create/use

`npx create-react-app graphic-representation-realt`
`cd graphic-representation-realt`
`npm start`
go to `http://localhost:3000/`

#### Feature

- Use Docker
- server : netlify

### Request :

From TheGraph :

```shell
xdai : https://api.thegraph.com/subgraphs/name/realtoken-thegraph/realtoken-xdai
rmm : https://api.thegraph.com/subgraphs/name/realtoken-thegraph/rmm-realt
eth : https://api.thegraph.com/subgraphs/name/realtoken-thegraph/realtoken-eth
```

From realT communitary api :

```shell
get info for each property : https://api.realt.community/v1/token/0x4637aa1a13aa4050c6e4bcd6dde9c39e80e9dd54
```

### TODO :

- make graphic for CityPropertyChart.js
- Include eth property
- Include rmm property
- % by TYPE of home mono-family/Multy-family/SFR Portfolio (where is this information?)
- % of portfolio in section 8, section 42, basic (where is this information?)
- CityPropertyChart.js : get city from other const (maybe address, with API?)
