// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);

  const WavesERC1155Token =
    await ethers.getContractFactory('WavesERC1155Token');
  const wavesERC1155Token = await WavesERC1155Token.deploy(
    'https://example.com/metadata/{id}.json',
    process.env.ADMIN_ADDRESS,
  );

  // await wavesERC1155Token.deployed();

  // console.log('WavesERC1155Token deployed to:', wavesERC1155Token.address);

  console.log('WavesERC1155Token deployed to:', wavesERC1155Token.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
