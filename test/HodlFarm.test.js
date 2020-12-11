const { assert } = require('chai')
const { Contract } = require('ethers')
const { default: Web3 } = require('web3')

const MockDai = artifacts.require('MockDai')
const HodlFarmTest = artifacts.require('HodlFarmTest')
const HodlToken = artifacts.require('HodlToken')

require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether')
}

contract('HodlFarmTest', ([owner, investor]) => {
    let mockDai, hodlToken, hodlFarm

    //recreate migration
    before( async() => {
        mockDai = await MockDai.new(tokens('10000'))
        hodlToken = await HodlToken.new(tokens('21000000'))
        hodlFarm = await HodlFarmTest.new(hodlToken.address, mockDai.address)

        //transfer hodlToken to hodlFarm
        await hodlToken.transfer(hodlFarm.address, tokens('21000000'))

        //transfer mockDai to investor
        await mockDai.transfer(investor, tokens('5000'), {from: owner})
    })


    describe('mockDai deployment', async() => {
        it('has a name', async() => {
            const name = await mockDai.name()
            assert.equal(name, 'MockDai', 'mockDai did not deploy properly')
        })

        it('users have tokens', async() => {
            const ownerBal = await mockDai.balanceOf(owner)
            const investorBal = await mockDai.balanceOf(investor)
            assert.equal(ownerBal.toString(), tokens('5000'), 'owner balance not correct')
            assert.equal(investorBal.toString(), tokens('5000'), 'investor balance not correct')
        })
    })

    describe('hodlToken deployment', async() => {
        it('has a name', async() => {
            const name = await hodlToken.name()
            assert.equal(name, 'Hodl', 'hodlToken did not deploy properly')
        })
    })

    describe('hodlFarm deployment', async() => {
        it('has a name', async() => {
            const name = await hodlFarm.name()
            assert.equal(name, 'HodlFarm', 'hodlFarm not properly deployed')
        })

        it('contract has tokens', async() => {
            const balance = await hodlToken.balanceOf(hodlFarm.address)
            assert.equal(balance.toString(), tokens('21000000'))
        })
    })


})

