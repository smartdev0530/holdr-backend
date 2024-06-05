async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);

  const WavesERC1155Token =
    await ethers.getContractFactory('WavesERC1155Token');
  const wavesERC1155Token = await WavesERC1155Token.deploy(
    'https://example.com/metadata/{id}.json',
    'YOUR-ADDRESS-HERE',
  );

  console.log('WavesERC1155Token deployed to:', wavesERC1155Token.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
