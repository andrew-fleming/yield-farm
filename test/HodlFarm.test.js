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

contract('HodlFarmTest', ([alice, bob]) => {
    let mockDai, hodlToken, hodlFarm

    //recreate migration
    before( async() => {
        mockDai = await MockDai.new(tokens('10000'))
        hodlToken = await HodlToken.new(tokens('21000000'))
        hodlFarm = await HodlFarmTest.new(hodlToken.address, mockDai.address)

        //transfer hodlToken to hodlFarm
        await hodlToken.transfer(hodlFarm.address, tokens('21000000'))

        //transfer mockDai to bob
        await mockDai.transfer(bob, tokens('5000'), {from: alice})
    })


    describe('mockDai deployment', async() => {
        it('has a name', async() => {
            const name = await mockDai.name()
            assert.equal(name, 'MockDai', 'mockDai did not deploy properly')
        })

        it('users have tokens', async() => {
            const aliceBal = await mockDai.balanceOf(alice)
            const bobBal = await mockDai.balanceOf(bob)
            assert.equal(aliceBal.toString(), tokens('5000'), 'alice balance not correct')
            assert.equal(bobBal.toString(), tokens('5000'), 'bob balance not correct')
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

    describe('farming tokens', async() => {
        it('rewards investors for staking', async() => {
            let result

            //check balance before staking
            result = await mockDai.balanceOf(alice)
            assert.equal(result.toString(), tokens('5000'))

            //check approval and staking
            await mockDai.approve(hodlFarm.address, tokens('5000'), {from: alice})
            await hodlFarm.stake(tokens('5000'), {from: alice})

            //check balance of alice's mDai
            result = await mockDai.balanceOf(alice)
            assert.equal(result.toString(), '0')

            //check that staking balance is correct
            result = await hodlFarm.stakingBalance(alice)
            assert.equal(result.toString(), tokens('5000'), 'staking balance fo alice is not correct')
        })
    })


})

