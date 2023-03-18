const { expect } = require("chai")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("ETHDaddy", () => {

  // name and symbol to test
  const NAME = "ETH Daddy";
  const SYMBOL = "ETHD";

  let ethDaddy;

  beforeEach(async()=>{
    // Set up accounts
    [deployer, owner1] = await ethers.getSigners();
    // Deploy contracts
    const ETHDaddy = await ethers.getContractFactory('ETHDaddy');
    ethDaddy = await ETHDaddy.deploy(NAME, SYMBOL); 

    // List Domains
    const transaction = await ethDaddy.connect(deployer).list("wasi.eth", tokens(10))
    await transaction.wait()
  })

  describe('Deployment', () => {
    
    it('Sets the name', async()=>{
        const result = await ethDaddy.name();
        expect(result).to.equal(NAME);
    })

    it('Sets the symbol', async() => {
      const result = await ethDaddy.symbol();
      expect(result).to.equal(SYMBOL);
    })

    it('Sets the owner', async() => {
      const result = await ethDaddy.owner();
      expect(result).to.equal(deployer.address);
    })

    it('Returns the max supply', async() => {
      const result = await ethDaddy.maxSupply();
      expect(result).to.equal(1);
    })
  })

  describe("Domain",  ()=>{
    it("returns domain attribute", async()=>{
      let domain = await ethDaddy.getDomains(1);
      expect(domain.name).to.be.equal("wasi.eth");
      expect(domain.cost).to.be.equal(tokens(10));
      expect(domain.isOwned).to.be.equal(false);
    })
  })

  describe("Minting",  ()=>{
    const ID = 1;
    const AMOUNT = ethers.utils.parseUnits("10", "ether")

    beforeEach(async() => {
      const transaction = await ethDaddy.connect(owner1).mint(ID, {value: AMOUNT});
      await transaction.wait();
    })
    
    it("Updates the owner", async()=>{
      const owner = await ethDaddy.ownerOf(ID);
      expect(owner).to.be.equal(owner1.address)
    })

    it('Updates the contract balance', async()=>{
      const balance = await ethDaddy.getBalance();
      expect(balance).to.equal(AMOUNT);
    })
  })
  
  describe("Minting",  ()=>{
    const ID = 1;
    const AMOUNT = ethers.utils.parseUnits("10", "ether")

    beforeEach(async() => {
      const transaction = await ethDaddy.connect(owner1).mint(ID, {value: AMOUNT});
      await transaction.wait();
    })
    
    it("Updates the owner", async()=>{
      const owner = await ethDaddy.ownerOf(ID);
      expect(owner).to.be.equal(owner1.address)
    })

    it('Updates the contract balance', async()=>{
      const balance = await ethDaddy.getBalance();
      expect(balance).to.equal(AMOUNT);
    })
  })

  describe("Withdraw", async() => {
    const ID = 1;
    const AMOUNT = ethers.utils.parseUnits("10", "ether");
    let balanceBefore;

    beforeEach(async() => {
      balanceBefore = await ethers.provider.getBalance(deployer.address);

      let transaction = await ethDaddy.connect(owner1).mint(ID, {value: AMOUNT});
      await transaction.wait();     
      
      transaction = await ethDaddy.connect(deployer).withdraw();
      await transaction.wait();
    })

    it('Updates the owner balance', async() => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address);
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    })

    it('Updates the contract balance', async() => {
      const result = await ethDaddy.getBalance()
      expect(result).to.be.equal(0);
    })
  })
})
