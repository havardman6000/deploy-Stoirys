Continue, also develop a testnet.



rys SDK
Installing
This example uses ETH for payment. You can use any of the supported tokens.
Install using npm:
npm install @irys/upload @irys/upload-ethereum


Connecting to the network
The following code is for using ETH for payment, we also have examples covering all supported tokens.
import { Uploader } from "@irys/upload";
import { Ethereum } from "@irys/upload-ethereum";
 
const getIrysUploader = async () => {
  const irysUploader = await Uploader(Ethereum).withWallet(process.env.PRIVATE_KEY);
  return irysUploader;
};


Funding Irys
Fund your account on the Irys network using any of our supported tokens:
const fundAccount = async () => {
	const irysUploader = await getIrysUploader();
	try {
		const fundTx = await irysUploader.fund(irysUploader.utils.toAtomic(0.05));
		console.log(`Successfully funded ${irysUploader.utils.fromAtomic(fundTx.quantity)} ${irysUploader.token}`);
	} catch (e) {
		console.log("Error when funding ", e);
	}
};


Uploading
Uploading Data
const uploadData = async () => {
	const irysUploader = await getIrysUploader();
	const dataToUpload = "hirys world.";
	try {
		const receipt = await irysUploader.upload(dataToUpload);
		console.log(`Data uploaded ==> https://gateway.irys.xyz/${receipt.id}`);
	} catch (e) {
		console.log("Error when uploading ", e);
	}
};


Uploading a File
const uploadFile = async () => {
	const irysUploader = await getIrysUploader();
	// Your file
	const fileToUpload = "./myImage.png";
 
	const tags = [{ name: "application-id", value: "MyNFTDrop" }];
 
	try {
		const receipt = await irysUploader.uploadFile(fileToUpload, { tags: tags });
		console.log(`File uploaded ==> https://gateway.irys.xyz/${receipt.id}`);
	} catch (e) {
		console.log("Error when uploading ", e);
	}
};


Uploading a Folder
You can upload a group of files as a single transaction from both the server and the browser.
ℹ️
When uploading a folder, files can be accessed either directly at https://gateway.irys.xyz/:transactionId or https://gateway.irys.xyz/:manifestId/:fileName
const uploadFolder = async () => {
	const irysUploader = await getIrysUploader();
 
	// Upload an entire folder
	const folderToUpload = "./my-images/"; // Path to folder
	try {
		const receipt = await irysUploader.uploadFolder("./" + folderToUpload, {
			indexFile: "", // Optional index file (file the user will load when accessing the manifest)
			batchSize: 50, // Number of items to upload at once
			keepDeleted: false, // whether to keep now deleted items from previous uploads
		}); // Returns the manifest ID
 
		console.log(`Files uploaded. Manifest ID ${receipt.id}`);
	} catch (e) {
		console.log("Error when uploading ", e);
	}
};


3rd-Party Build Tools
Parcel
If using Parcel
(opens in a new tab)
, you will need to manually enable package exports
(opens in a new tab)
 by adding the following to the package.json file in your project root directory.
{
	"@parcel/resolver-default": {
		"packageExports": true
	}
}
  Networks
Irys has two networks:
* Testnet: Uploads are paid for with real tokens. At mainnet launch, all data uploaded to testnet bundlers will be migrated to mainnet, with no changes to transaction IDs.
* Devnet: Uploads are paid for with free faucet tokens. Data is deleted after ~60 days.
Connecting to Testnet
ℹ️
The following code is for using ethereum only, we also have examples covering all of the tokens we support for payment.
import { Uploader } from "@irys/upload";
import { Ethereum } from "@irys/upload-ethereum";
 
const getIrysUploader = async () => {
  const irysUploader = await Uploader(Ethereum).withWallet(process.env.PRIVATE_KEY);
  return irysUploader;
};


Connecting to Devnet
ℹ️
The following code is for using ethereum only, we also have examples covering all of the tokens we support for payment.
To connect to devnet, append the functions withRpc() and devnet(). RPC URLs are required when using devnet.
import { Uploader } from "@irys/upload";
import { Ethereum } from "@irys/upload-ethereum";
 
const getIrysUploader = async () => {
  // RPC URLs change often. Use a current one from https://chainlist.org/
  const rpcURL = ""; 
  const irysUploader = await Uploader(Ethereum)
    .withWallet(process.env.PRIVATE_KEY)
    .withRpc(rpcURL)
    .devnet();
 
  return irysUploader;
};
 Supported Tokens
Iyrs supports most popular tokens for paying for uploads.
Testnet
On our testnet, you can pay for uploads in any of these tokens:
Token / Blockchain	Token	Parameter Value	Node Support	Browser Support
Aptos	APT	aptos	yes	yes
Algorand	ALGO	algorand	yes	no
Arbitrum	ETH	arbitrum	yes	yes
Avalanche C-Chain	AVAX	avalanche	yes	yes
Berachain	BERA	bera	yes	yes
Binance Coin	BNB	bnb	yes	yes
Boba	BOBA	boba	yes	yes
Boba-eth	ETH	boba-eth	yes	yes
Chainlink	LINK	chainlink	yes	yes
Eclipse-eth	ETH	eclipse-eth	yes	yes
Ethereum	ETH	ethereum	yes	yes
Base Ethereum	ETH	base-eth	yes	yes
Linea Ethereum	ETH	linea-eth	yes	yes
Scroll Ethereum	ETH	scroll-eth	yes	yes
Fantom	FTM	fantom	yes	yes
IoTeX	IoTeX	iotex	yes	yes
Near	NEAR	near	yes	yes
Polygon	MATIC	matic	yes	yes
Solana	SOL	solana	yes	yes
USDC (on Ethereum)	USDC	usdc-eth	yes	yes
USDC (on Polygon)	USDC	usdc-polygon	yes	yes
USDC (on Solana)	USDC	usdc-solana	yes	yes
Starknet	STRK	starknet	yes	no
Devnet
On devnet, uploads are paid for with free faucet tokens. Data is deleted after ~60 days.
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
Connecting to Irys
The Irys SDK reduces dependency bloat by providing dedicated packages for each token. Your import statements and connection code will differ depending on the token used for payment.
The following code is for using ethereum only, we also have examples covering all of the tokens we support for payment.
import { Uploader } from "@irys/upload";
import { Ethereum } from "@irys/upload-ethereum";
 
const getIrysUploader = async () => {
  const irysUploader = await Uploader(Ethereum).withWallet(process.env.PRIVATE_KEY);
  return irysUploader;
};  Metadata Tagging
Irys supports attaching metadata tags to each transaction.
Tags can be used to:
* Categorize transactions, making it easier to search for and retrieve relevant information
* Create mutable data
* Inform web browsers how to render files (e.g. Content-Type = image/png)
Querying
Tags are indexed by gateways and are queryable using GraphQL.
Content-Type
Irys automatically infers and sets the appropriate Content-Type
(opens in a new tab)
 tag based on the file extension when uploading files and folders. You can also manually set the Content-Type tag, doing so will override the default behavior and apply the value you provide.
// Your file
const fileToUpload = "./myImage.png";
 
// Add a custom Content-Type tag
const tags = [{ name: "Content-Type", value: "image/png" }];
 
try {
	const response = await irys.uploadFile(fileToUpload, { tags: tags });
	console.log(`File uploaded ==> https://gateway.irys.xyz/${response.id}`);
} catch (e) {
	console.log("Error uploading file ", e);
}


You can also add tags via the CLI's -t option, followed by a series of name / value pairs
irys upload myImage.png \
  -n testnet \
  -t ethereum \
  -w bf20......c9885307 \
  --tags tagName1 tagValue1 tagName2 tagValue2 \
  --provider-url https://rpc.sepolia.dev


Additional Uses
You can add up to 20 tags to each transaction, enabling the construction of semi-relational models within your data.
A popular practice involves creating an application-id tag, this tag helps segregate your uploads from others.
// Your file
const fileToUpload = "./myNFT.png";
 
const tags = [{ name: "application-id", value: "NFTs To The Moon" }];
 
try {
	const response = await irys.uploadFile(fileToUpload, { tags: tags });
	console.log(`File uploaded ==> https://gateway.irys.xyz/${response.id}`);
} catch (e) {
	console.log("Error uploading file ", e);
}
 Mutability
Data on Irys is immutable. However, you can simulate mutability on using mutable references.
With mutable references you create a single, static URL that is linked to a sequential series of transactions. You can add a new transaction to the series at any time, and the URL will always resolve to the most recent transaction in the chain.
￼
To create a mutable reference:
1. Upload a base transaction to Irys and reference it using a URL in the following format https://gateway.irys.xyz/mutable/:txId
ℹ️
Use a token-specific version of getIrysUploader() to connect to an Irys Bundler before uploading. Choose one from here.
const irysUploader = await getIrysUploader();
const receiptOne = await irysUploader.upload("First TX");
console.log(`TX 1 uploaded https://gateway.irys.xyz/mutable/${receiptOne.id}`);


1. Upload an addition to the series as a new transaction, and add a tag named Root-TX with the value of the original transaction ID.
const tags = [{ name: "Root-TX", value: receiptOne.id }];
const receiptTwo = await irysUploader.upload("Second TX", { tags: tags });
console.log(`TX 2 uploaded https://gateway.irys.xyz/mutable/${receiptOne.id}`);


The original URL (https://gateway.irys.xyz/mutable/:txId) now resolves to the second transaction in the chain.
ℹ️
When building a transaction chain, additions must be made using the same wallet that created the original transaction. This prevents unauthorized actors from maliciously modifying someone else’s transaction chain.
Granularity
Mutable references are based on Irys’s millisecond-accurate timestamps. You can publish multiple sequential updates to a given transaction and be confident the transaction served by the /mutable/ endpoint will always be the most recent chronological one.
Versions
While the https://gateway.irys.xyz/mutable/:txId endpoint will always resolve to the most recent transaction in a chain, it is possible to directly access any transaction in a chain using the transaction’s ID and a URL in the format https://gateway.irys.xyz/:id
You can query a version chain using GraphQL:
query getChain {
  transactions(
    tags: [
      {
        name: "Root-TX"
        values: ["WF--VR1ZERvABYy1aNYD3QJ0OAVDSUF8dTlg6zFKveQ"]
      }
    ]
    owners: ["0x591b5ce7ca10a55a9b5d1516ef89693d5b3586b8"]
    order: ASC
  ) {
    edges {
      node {
        id
        timestamp
      }
    }
  }
}


Use-Cases
Irys’s mutable references open up new opportunities for builders, including:
* Gaming NFTs: Metadata changes based on in-game actions
* Dynamic NFTs: Images change based on onchain activity
* Software distribution: The latest version is always available via the same link
* Content publishing / social media: Content can be updated at any time and users will always have the most recent version
* Website hosting / dApp front-ends: Websites can be updated at any time without changing the main URL
  Onchain Folders
Onchain folders are powerful way to organize transactions on Irys. Use them to reference onchain data by logical names instead of transaction IDs.
￼
Why Use Onchain Folders?
* Logical Grouping: Create organized and readable structures for onchain data.
* Human-Readable Referencing: Replace transaction IDs with logical names, improving accessibility.
* Cross-Ownership Grouping: Include any transactions on Irys, even if they weren’t created by you.
* Flexibility: Add new files to existing folders at any time.
How The Irys Gateway Resolves Onchain Folders
Each onchain folder is uniquely identifiable by a manifest ID. To download transactions in an onchain folder, request them from the Irys gateway using a URL formatted as:
https://gateway.irys.xyz/:manifestId/:pathName
The gateway then:
1. Looks up the manifest by ID.
2. Looks in the manifest to see if the path exists.
3. Returns the transaction associated with the path if found.
4. Returns 404 if not found.
For example, if you have a manifest with ID 8eNpkShMwdbiNBtGuVGBKp8feDZCa21VppX2eDi3eLME containing the following:
Tx ID	Path Name
DTMcqFqwaDukaYxs7iK2fa6CuMtyi7sN93rBGSAa13Ug	foo1.png
5TQU2ETHGRPjJKPoeQkkgMB6zRpK8ptheWF8jdkbtJHR	foo2.png
8nond6kkdYS14QjA5tZNCRDQQrgVNd7gdhx3L4XRJD1b	foo3.png
https://gateway.irys.xyz/8eNpkShMwdbiNBtGuVGBKp8feDZCa21VppX2eDi3eLME/foo1.png
Creating Onchain Folders
Automatically
When you upload groups of files using the Irys SDK's uploadFolder() function or the CLI's upload-dir command, an onchain folder for you is automatically created for you. The return value contains the manifest ID, which can be combined with the original file names as above.
Manually
To manually create an onchain folder:
1. Create a JavaScript Map object where each entry maps a unique transaction ID to a unique path. (Paths are arbitrary; you can use anything that conforms to valid URL syntax.)
2. Create a Manifest object by passing the Map object to irys.uploader.generateFolder().
3. Upload the Manifest object to Irys.
const createOnchainFolder = async () => {
  const irysUploader = await getIrysUploader();
 
  // You can map ANY logical name to ANY transaction ID
  const map = new Map();
  map.set("image-1.png", "DTMcqFqwaDukaYxs7iK2fa6CuMtyi7sN93rBGSAa13Ug");
  map.set("image-2.png", "5TQU2ETHGRPjJKPoeQkkgMB6zRpK8ptheWF8jdkbtJHR");
  map.set("image-3.png", "8nond6kkdYS14QjA5tZNCRDQQrgVNd7gdhx3L4XRJD1b");
 
  const manifest = await irysUploader.uploader.generateFolder({ items: map });
  console.log({ manifest });
 
  const tags = [
    { name: "Type", value: "manifest" },
    { name: "Content-Type", value: "application/x.irys-manifest+json" },
  ];
  const receipt = await irysUploader.upload(JSON.stringify(manifest), { tags });
  console.log(`Manifest uploaded to https://gateway.irys.xyz/${receipt.id}`);
  console.log(`File 1 available at https://gateway.irys.xyz/${receipt.id}/image-1.png`);
  console.log(`File 2 available at https://gateway.irys.xyz/${receipt.id}/image-2.png`);
  console.log(`File 3 available at https://gateway.irys.xyz/${receipt.id}/image-3.png`);
};


Mutable Onchain Folders
Mutable onchain folders let you add new files to an existing folder after it’s created. By using a single, static URL that always points to the most recent version, you can expand an NFT collection, add updated documents, or manage evolving datasets without needing to change the original reference. This approach ensures consistency while allowing dynamic updates over time, with the security that only the original creator can modify the folder's contents.
How to Create Mutable Onchain Folders
1. Upload the Initial Folder: Use the SDK or CLI to upload your initial set of files. This will create a base manifest ID that uniquely identifies the folder.
2. Reference Files Using a Mutable URL: Reference files in this folder using a URL formatted as https://gateway.irys.xyz/mutable/:manifestId/:fileName. This URL will always resolve to the most recent version of the folder.
3. Upload New Files: When you need to add new files, upload them individually using the SDK or CLI.
4. Create a Onchain Folder: Manually create a new onchain folder that includes both the original files and any new files as outlined above.
5. Tag the New Manifest: Upload the new onchain folder to Irys, tagging it with Root-TX equal to the original manifest ID. This links the new onchain folder to the original folder; the "mutable" URL remains consistent.
6. Access the Updated Folder: The URL https://gateway.irys.xyz/mutable/:manifestId/:fileName will now point to the latest version of the folder, including all newly added files.
import { Uploader } from "@irys/upload";
import { Ethereum } from "@irys/upload-ethereum";
import "dotenv/config";
import fetch from "node-fetch"; 
 
const getIrysUploader = async () => {
  const irysUploader = await Uploader(Ethereum).withWallet(process.env.PRIVATE_KEY);
  return irysUploader;
};
 
const downloadOriginalManifest = async (originalManifestId: string) => {
  try { 
    const response = await fetch(`https://gateway.irys.xyz/${originalManifestId}`);
    if (!response.ok) throw new Error("Failed to fetch original manifest");
    return response.json();
  } catch (error) {
    console.error("Error downloading original manifest", error);
    throw error;
  }
};
 
const appendToManifest = (originalManifest: any, newFiles: Map<string, string>)  => {
  newFiles.forEach((txId, fileName) => {
    originalManifest.paths[fileName] = { id: txId };
  });
  return originalManifest;
};
 
const uploadManifest = async (manifest: any, originalManifestId: string): Promise<void> => {
  const irysUploader = await getIrysUploader();
 
  const manifestTags = [
    { name: "Type", value: "manifest" },
    { name: "Content-Type", value: "application/x.irys-manifest+json" },
    { name: "Root-TX", value: originalManifestId },
  ];
 
  try {
    const manifestResponse = await irysUploader.upload(JSON.stringify(manifest), { tags: manifestTags });
    console.log(`Manifest uploaded ==> https://gateway.irys.xyz/mutable/${originalManifestId}`);
  } catch (e) {
    console.error("Error uploading manifest", e);
  }
};
 
const main = async () => {
  try {
    // Your original manifest ID
    const originalManifestId = "8eNpkShMwdbiNBtGuVGBKp8feDZCa21VppX2eDi3eLME";
 
    // Step 1: Download the original manifest
    const originalManifest = await downloadOriginalManifest(originalManifestId);
 
    // Step 2: Prepare new files to add to the manifest
    const newFiles = new Map<string, string>();
    newFiles.set("new-1.png", "4pTiwGwur38s4vyVD8EERxDYgAGDM8kyzEh9c5QPF9Zw");
    newFiles.set("new-2.png", "BieiKJE1Nh6ydCYqxmDjHFGzuG7enRr6NYmKisqSwUQo");
 
    // Step 3: Append new files to the manifest
    const updatedManifest = appendToManifest(originalManifest, newFiles);
 
    // Step 4: Upload the updated manifest
    await uploadManifest(updatedManifest, originalManifestId);
  } catch (e) {
    console.error("Error in main execution", e);
  }
};
 
main();


Balance Approvals
Use balance approvals to share balances between multiple addresses. This helps to onboard users without requiring them to own tokens.
With balance approvals:
* You pay for transactions.
* Users sign transactions.
Balance approvals:
* Are based on the token set when connecting to an Irys node. Both approver and approvee must use the same token.
* Are registered instantly upon upload completion.
* Are non-transferable.
* Can be configured to expire automatically.
Create an Approval
To update an existing approval, create a new approval with the same address (it will overwrite the existing approval).
const receipt = await irys.approval.createApproval({
	amount: irys.utils.toAtomic(1), // Amount in atomic units
	approvedAddress: "<address>",
	expiresInSeconds: 100, // Expires in 100 seconds. Delete to remove expiration.
});


Upload Using an Approval
const receipt = await irys.upload("Hirys World", { upload: { paidBy: "<address>" } });


Combine approvals and tags:
const uploadOptions = {
	upload: {
		paidBy: "<address>",
	},
	tags: [{ name: "Content-Type", value: "text/plain" }],
};
const receipt = await irys.upload(dataToUpload, uploadOptions);


Revoke an Approval
const receipt = await irys.approval.revokeApproval({ approvedAddress: "<address>" });


Get Balances You're Approved To Use
Get approvals from the array of addresses provided:
const approvals = await irys.approval.getApprovals({
	payingAddresses: ["<address>"],
});


Get the first 100 approvals:
const approvals = await irys.approval.getApprovals({});


Return type:
{
	amount: string; // Amount approved in atomic units
	payingAddress: string; // Address of the payer's wallet
	approvedAddress: string; // Address of the wallet that received the approval
	expiresBy: number; // Timestamp (in milliseconds) when approval expires
	timestamp: number; // Timestamp (in milliseconds) when the approval was created
	token: string; // Approved token
}
[];


Get Approvals You've Created
Get approvals for the array of addresses provided:
const createdApprovals = irys.approval.getCreatedApprovals({
	approvedAddresses: ["<address>"],
});


Get the first 100 approvals you've created:
const createdApprovals = irys.approval.getCreatedApprovals({});


Return type:
{
	amount: string; // Amount approved in atomic units
	payingAddress: string; // Address of the payer's wallet
	approvedAddress: string; // Address of the wallet that received the approval
	expiresBy: number; // Timestamp (in milliseconds) when approval expires
	timestamp: number; // Timestamp (in milliseconds) when the approval was created
	token: string; // Approved token
}
[];


Get Balance Approvals via HTTP
You can also request balance approvals via HTTP:
Testnet:
https://testnet.irys.xyz/account/approval?payingAddress=<...>&token=<...>&approvedAddress=<...>


Transaction IDs
Transaction IDs uniquely identify transactions on Irys. When you upload data via a bundler, you receive a receipt containing the transaction ID, this serves as a reference for retrieving or verifying that data.
Encoding
Transaction IDs are base58 encoded.
ℹ️
Base58 is a binary-to-text encoding scheme that is commonly used in Bitcoin and Solana. It uses an alphabet of 58 characters, which is the same as the Base64 encoding scheme, but omits the characters 0, O, I, and l to avoid confusion between similar-looking letters and numbers.
Downloading Data with Transaction IDs
Use your unique transaction ID to download data from our gateway using a URL in the format
https://gateway.irys.xyz/:transactionId
Example
https://gateway.irys.xyz/CO9EpX0lekJEfXUOeXncUmMuG8eEp5WJHXl9U9yZUYA
Manually Creating a Transaction
In addition to uploading using the SDK functions irys.upload(),irys.uploadFile(), and irys.uploadFolder(), you can also manually create, sign, and upload a transaction in separate steps.
Workflow
1. const tx = irys.createTransaction()
2. await tx.sign()
3. await tx.upload()
After calling tx.sign(), you can access the transaction ID via tx.id, this facilitates use cases where you need access to the ID before uploading the full transaction.
ℹ️
You must call tx.sign() before using the value of tx.id.
Creating, Signing, Uploading
Basic workflow.
ℹ️
Use a token-specific version of getIrysUploader() to connect to an Irys Bundler before uploading. Choose one from here.
const createSignUpload = async () => {
	// Get a reference to a pre-configured Irys object
	const irys = await getIrysUploader();
 
	// Create the transaction
	const tx = irys.createTransaction("Hirys World!", { tags: [{ name: "Content-Type", value: "text/plain" }] });
 
	// Sign the transaction
	await tx.sign(); // ID is now set
	console.log(`Tx created and signed, ID=${tx.id}`);
 
	// Upload the transaction
	const receipt = await tx.upload();
	console.log(`Tx uploaded. https://gateway.irys.xyz/${receipt.id}`);
};


Serializing a Transaction
Serialize a transaction and recreate it later.
const serializationUpload = async () => {
	// Get a reference to a pre-configured Irys object
	const irys = await getIrysUploader();
 
	// Create the transaction
	const tx1 = irys.createTransaction("Hirys World!", { tags: [{ name: "Content-Type", value: "text/plain" }] });
	// Note: You can sign before *or* after serializing
	await tx1.sign(); // ID is now set
	console.log(`Tx created and signed, ID=${tx1.id}`);
 
	// Serialize the transaction
	const txSerialized = tx1.getRaw();
 
	// Recreate the transaction from the serialized version
	const tx2 = irys.transaction.fromRaw(txSerialized);
	// ID is the same as before
	console.log(`Tx re-created from serialized, ID=${tx2.id}`);
 
	// Upload the tx
	const receipt = await tx2.upload();
 
	console.log(`Tx uploaded. https://gateway.irys.xyz/${receipt.id}`);
};


Deterministic ID
Use a deterministic ID in cases where you need access to a transaction ID before uploading, but can't or don't want to store a reference to the transaction object.
First, generate an anchor and use that to create a transaction with your data. Then, sign the transaction and you can access the ID. Finally, you can recreate the transaction using the same anchor and data and your ID will be the same.
const deterministicIDUpload = async () => {
	// Get a reference to a pre-configured Irys object
	const irys = await getIrysUploader();
 
	// Generate 32 bytes through Buffer.from(anchor)
	const anchor = randomBytes(16).toString("hex");
	const tx1 = irys.createTransaction("Hirys Irys!", {
		tags: [{ name: "content-type", value: "text/plain" }],
		anchor,
	});
	await tx1.sign();
	console.log(`Tx1 ID ${tx1.id}`); // ID is now set
 
	const tx2 = irys.createTransaction("Hirys Irys!", {
		tags: [{ name: "content-type", value: "text/plain" }],
		anchor,
	});
	await tx2.sign();
	console.log(`Tx2 ID ${tx2.id}`); // ID is the same
	const receipt = await tx2.upload();
	console.log(`Tx uploaded. https://gateway.irys.xyz/${receipt.id}`);
};


IPFS Content IDs
In addition to using Irys transaction IDs, you can also use IPFS Content IDs (CIDs) when addressing data on Irys.
ℹ️
Irys does not currently verify that CIDs match their uploaded data. This will be added in a future release.
Content IDs vs transaction IDs
IPFS and Irys take a different approach to identifying data, IPFS uses Content Identifiers (CIDs) and Irys uses transaction IDs.
* IPFS Content Identifiers (CIDs) are generated by hashing the content being uploaded. The same data uploaded twice will generate the same CID.
* Irys transaction IDs are generated by hashing the content + metadata being uploaded. All uploads have a unique transaction ID.
Uploading with a CID
To upload data to Irys using a CID, embed it as the value of the IPFS-CID tag when uploading data.
ℹ️
Use a token-specific version of getIrysUploader() to connect to an Irys Bundler before uploading. Choose one from here.
import IPFS from "ipfs-only-hash";
 
const generateCID = async (content) => {
	return await IPFS.of(content);
};
 
const uploadToIrysWithCID = async () => {
	const irys = await getIrysUploader();
 
	const dataToUpload = "Irys + IPFS Content ID";
	const contentID = await generateCID(dataToUpload);
	console.log(`ContentID=${contentID}`);
 
	const tags = [
		{ name: "Content-Type", value: "text/html" },
		{ name: "IPFS-CID", value: contentID },
	];
	const receipt = await irys.upload(dataToUpload, { tags: tags });
 
	// You can download using either the Irys transaction ID or IPFS Content ID
	console.log(`Transaction ID URL https://gateway.irys.xyz/${receipt.id}`);
	console.log(`Content ID URL https://gateway.irys.xyz/ipfs/${contentID}`);
};


ℹ️
This code example generates a CID using the ipfs-only-hash package which uses the SHA-256 algorithm by default. IPFS also allows CIDs to be generated using SHA3 and Blake2, all of which are supported when uploading to Irys.
Downloading with a CID
To download data tagged with a CID, request it from the Irys gateway using a URL in the format https://gateway.irys.xyz/ipfs/:contentID.
ℹ️
If the same CID is assigned to more than one transaction, the Irys gateway will always return the one with the earliest timestamp.
const fetchData = async (ipfsCID) => {
	const url = `https://gateway.irys.xyz/ipfs/${ipfsCID}`;
	console.log(`URL: ${url}`);
 
	const response = await fetch(url);
	const data = await response.text();
	console.log(`DATA: ${data}`);
};


Migrating data from IPFS to Irys
You can migrate data from IPFS to Irys by first downloading the data from an IPFS gateway and then uploading it to Irys. Users can choose to tag the uploads with the original IPFS CID and continue to retrieve data using the CID, or switch to using Irys transaction IDs.
This code example shows how to:
1. Download data from an IPFS gateway
2. Determine the data's content type (for example: image/png)
3. Re-upload the data to Irys while tagging it with the existing content type
ℹ️
Prior to uploading, users must fund an Irys node. Most users will choose to up-front fund where they pre-fund an Irys node with sufficient tokens to cover all data being migrated. Users can also choose to lazy-fund the uploads where you fund each separate upload.
import fetch from "node-fetch";
import { fileTypeFromBuffer } from "file-type";
 
const uploadToIrysWithCID = async (dataToUpload, contentType, contentID) => {
	const irys = await getIrysUploader();
 
	const tags = [
		{ name: "Content-Type", value: contentType },
		{ name: "IPFS-CID", value: contentID },
	];
	const receipt = await irys.upload(dataToUpload, { tags: tags });
	console.log(`Direct URL: https://gateway.irys.xyz/${receipt.id}`);
	console.log(`Content ID URL: https://gateway.irys.xyz/ipfs/${contentID}`);
};
 
const downloadAndDetermineContentType = async (ipfsCID) => {
	try {
		const ipfsURL = `https://ipfs.io/ipfs/${ipfsCID}`;
		const response = await fetch(ipfsURL);
		const arrayBuffer = await response.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
 
		const contentType = await fileTypeFromBuffer(buffer);
 
		if (contentType) {
			console.log(`Content Type: ${contentType.mime}`);
			await uploadToIrysWithCID(buffer, contentType.mime, ipfsCID);
		} else {
			console.error("Unable to determine content type");
		}
	} catch (error) {
		console.error("Error:", error);
	}
};
 
const ipfsCID = "QmUgL4YbnW9vMWZXLdAFzgxJwxpxJapZRLpjoT2ubU5WmF";
downloadAndDetermineContentType(ipfsCID);


Receipts
Receipts give you cryptographic proof of the exact time, accurate to the millisecond, that a transaction was posted.
Receipts & Timestamps
When you upload data to Irys, it is stamped with a millisecond-accurate timestamp before being stored onchain.
Blockchains rely on timestamps to sequence the order of transactions and blocks. Transaction sequencing plays a critical role in blockchain security as it ensures that all transactions are recorded in the correct order, and that order is never changed.
Receipts provide cryptographic proof of a timestamp.
Ordering & Streaming
Ordering and streaming applications process and deliver data in real-time. They're commonly used for messaging, event processing, and data integration. They transfer high data volumes between independent applications while maintaining high performance and scalability. Popular examples include Apache Kafka and RabbitMQ.
Why Use Signed Receipts?
Cryptographically signed receipts open up new development options for builders. For example:
1. Sequential ordering of posts, likes and comments for a decentralized social protocol.
2. Sequential ordering of data generated by a group messaging protocol.
3. Automatically adjudicating music copyright claims.
4. Preserving history, ensuring it's not manipulated over time.
5. Preserving scientific research using Irys's pay-once, store-forever model.
Receipt Permanence
Upon posting a transaction to Irys, a receipt is immediately returned to the user.
Irys maintains an internal registry of all receipts, which can be queried whenever a receipt is needed. These receipts are stored in a centralized fashion, which may be sufficient for users comfortable with the trust assumptions of centralized services.
You can also opt to permanently store your receipt on Irys by uploading it using our SDK or CLI.
Receipt format
Receipts are a JSON object with the following format:
{
  id: '1Txlbl5NgEqUbIkDnnunHC0gFx0n8_Y92zAsoX54kI8',
  timestamp: 1676891681110,
  version: '1.0.0',
  public: '...',
  signature: '...',
  deadlineHeight: ...,
  block: ...,
  validatorSignatures: [],
}


Field	Description
ID	Transaction ID (used to download the data)
timestamp	Timestamp (UNIX milliseconds) of when the transaction was created
version	The version of this JSON file, currently 1.0.0
public	Public key of the bundler node used
signature	A signed deep hash of the JSON receipt
deadlineHeight	The block number by which the transaction must be finalized
block	Deprecated
validatorSignatures	Deprecated
Verifying Receipts
You may need to verify a receipt at some point after it was issued. For example, if your application’s security depends on the order of transactions, you can then verify every receipt to ensure its order has not been tampered with.
The receipt contains a signature field, which is generated by creating a deep hash of information from the receipt, including transaction ID and timestamp. The receipt is then signed it by Irys.
Using the Irys SDK you can verify the signature using the using the same values from the receipt along with the supplied public key.
Timestamp Generation
Irys records the precise time of each transaction with a UNIX timestamp in milliseconds. This timestamp is generated by the node that first receives and verifies the transaction.
Installing, Importing & Configuring
The Irys SDK reduces dependency bloat by providing dedicated packages for each token. Your install statements, import and connection code will differ depending on the token used for payment.
Select the appropriate code from the options below when starting your project.
APTOS | Arbitrum | Avalanche C-Chain | Berachain | BNB | Chainlink | Eclipse-eth | Ethereum | Base Ethereum | Linea Ethereum | Scroll Ethereum | IoTeX | Polygon | Solana | USDC (on Ethereum) | USDC (on Polygon)
ℹ️
The following code examples connect to our alpha testnet. To switch to our devnet, append the functions withRpc() and devnet() as outlined here.
Aptos
Installing:
npm install @irys/upload @irys/upload-aptos


Importing & Configuring:
import { Uploader } from "@irys/upload";
import { Aptos } from "@irys/upload-aptos";
 
const getIrysUploader = async () => {
  const irysUploader = await Uploader(Aptos).withWallet(process.env.PRIVATE_KEY);
  return irysUploader;
};


Arbitrum
Installing:
npm install @irys/upload @irys/upload-ethereum


Importing & Configuring:
import { Uploader } from "@irys/upload";
import { Arbitrum } from "@irys/upload-ethereum";
 
const getIrysUploader = async () => {
  const irysUploader = await Uploader(Arbitrum).withWallet(process.env.PRIVATE_KEY);
  return irysUploader;
};


Avalanche C-Chain
Installing:
npm install @irys/upload @irys/upload-ethereum


Importing & Configuring:
import { Uploader } from "@irys/upload";
import { Avalanche } from "@irys/upload-ethereum";
 
const getIrysUploader = async () => {
  const irysUploader = await Uploader(Avalanche).withWallet(process.env.PRIVATE_KEY);
  return irysUploader;
};


Berachain
Installing:
npm install @irys/upload @irys/upload-ethereum


Importing & Configuring:
import { Uploader } from "@irys/upload";
import { Bera } from "@irys/upload-ethereum";
 
const getIrysUploader = async () => {
  const irysUploader = await Uploader(Bera).withWallet(process.env.PRIVATE_KEY);
  return irysUploader;
};


BNB
Installing:
npm install @irys/upload @irys/upload-ethereum


Importing & Configuring:
import { Uploader } from "@irys/upload";
import { BNB } from "@irys/upload-ethereum";
 
const getIrysUploader = async () => {
  const irysUploader = await Uploader(BNB).withWallet(process.env.PRIVATE_KEY);
  return irysUploader;
};


Chainlink
Installing:
npm install @irys/upload @irys/upload-ethereum


Importing & Configuring:
import { Uploader } from "@irys/upload";
import { Chainlink } from "@irys/upload-ethereum";
 
const getIrysUploader = async () => {
  const irysUploader = await Uploader(Chainlink).withWallet(process.env.PRIVATE_KEY);
  return irysUploader;
};


Eclipse-eth
Installing:
npm install @irys/upload @irys/upload-solana


Importing & Configuring:
import { Uploader } from "@irys/upload";
import { EclipseEth } from "@irys/upload-solana";
 
const getIrysUploader = async () => {
  const irysUploader = await Uploader(EclipseEth).withWallet(process.env.PRIVATE_KEY);
  return irysUploader;
};


Ethereum
Installing:
npm install @irys/upload @irys/upload-ethereum


Importing & Configuring:
import { Uploader } from "@irys/upload";
import { Ethereum } from "@irys/upload-ethereum";
 
const getIrysUploader = async () => {
  const irysUploader = await Uploader(Ethereum).withWallet(process.env.PRIVATE_KEY);
  return irysUploader;
};


Base Ethereum
Installing:
npm install @irys/upload @irys/upload-ethereum


Importing & Configuring:
import { Uploader } from "@irys/upload";
import { BaseEth } from "@irys/upload-ethereum";
 
const getIrysUploader = async () => {
  const irysUploader = await Uploader(BaseEth).withWallet(process.env.PRIVATE_KEY);
  return irysUploader;
};


Linea Ethereum
Installing:
npm install @irys/upload @irys/upload-ethereum


Importing & Configuring:
import { Uploader } from "@irys/upload";
import { LineaEth } from "@irys/upload-ethereum";
 
const getIrysUploader = async () => {
  const irysUploader = await Uploader(LineaEth).withWallet(process.env.PRIVATE_KEY);
  return irysUploader;
};


Scroll Ethereum
Installing:
npm install @irys/upload @irys/upload-ethereum


Importing & Configuring:
import { Uploader } from "@irys/upload";
import { ScrollEth } from "@irys/upload-ethereum";
 
const getIrysUploader = async () => {
  const irysUploader = await Uploader(ScrollEth).withWallet(process.env.PRIVATE_KEY);
  return irysUploader;
};


IoTeX
Installing:
npm install @irys/upload @irys/upload-ethereum


Importing & Configuring:
import { Uploader } from "@irys/upload";
import { Iotex } from "@irys/upload-ethereum";
 
const getIrysUploader = async () => {
  const irysUploader = await Uploader(Iotex).withWallet(process.env.PRIVATE_KEY);
  return irysUploader;
};


Polygon
Installing:
npm install @irys/upload @irys/upload-ethereum


Importing & Configuring:
import { Uploader } from "@irys/upload";
import { Matic } from "@irys/upload-ethereum";
 
const getIrysUploader = async () => {
  const irysUploader = await Uploader(Matic).withWallet(process.env.PRIVATE_KEY);
  return irysUploader;
};


Solana
Installing:
npm install @irys/upload @irys/upload-solana


Importing & Configuring:
import { Uploader } from "@irys/upload";
import { Solana } from "@irys/upload-solana";
 
const getIrysUploader = async () => {
  const irysUploader = await Uploader(Solana).withWallet(process.env.PRIVATE_KEY);
  return irysUploader;
};


USDC (on Ethereum)
Installing:
npm install @irys/upload @irys/upload-ethereum


Importing & Configuring:
import { Uploader } from "@irys/upload";
import { USDCEth } from "@irys/upload-ethereum";
 
const getIrysUploader = async () => {
  const irysUploader = await Uploader(USDCEth).withWallet(process.env.PRIVATE_KEY);
  return irysUploader;
};


USDC (on Polygon)
Installing:
npm install @irys/upload @irys/upload-ethereum


Importing & Configuring:
import { Uploader } from "@irys/upload";
import { USDCPolygon } from "@irys/upload-ethereum";
 
const getIrysUploader = async () => {
  const irysUploader = await Uploader(USDCPolygon).withWallet(process.env.PRIVATE_KEY);
  return irysUploader;
};


fund(amount, multiplier?)
Funds your account with the specified number of tokens.
Parameters
Name
Type
Description
amount
BigNumber
The amount to fund in atomic units.
multiplier
number
(optional) Fee multiplier.
Returns
Type
Description
object
A JSON object with the following values.
response = {
	id, // The transaction ID of the fund transfer
	quantity, // How much is being transferred
	reward, // The amount taken by the network as a fee
	target, // The address the funds were sent to
};


You can choose to upfront fund where you cover the cost of future uploads, or use lazy-funding where you fund per-upload.
Upfront Funding
Upfront funding reduces the number of transactions required when uploading. You fund once and then when uploading, payment is deducted directly from your account. You can also withdraw any excess balance if needed.
ℹ️
Use a token-specific version of getIrysUploader() to connect to an Irys Bundler before uploading. Choose one from here.
try {
  const irys = await getIrysUploader();
 
  const fundTx = await irys.fund(irys.utils.toAtomic(0.05));
  console.log(
    `Successfully funded ${irys.utils.fromAtomic(fundTx.quantity)} ${
      irys.token
    }`
  );
} catch (e) {
  console.log("Error funding node ", e);
}


Lazy-Funding
try {
  const irys = await getIrysUploader();
 
  const pathToFile = "./myNFT.png";
  const { size } = await fs.promises.stat(pathToFile);
  const price = await irys.getPrice(size);
  await irys.fund(price);
 
  const { id } = await irys.uploadFile(pathToFile);
  console.log(
    `${pathToFile} --> Uploaded to https://gateway.irys.xyz/${id}`
  );
} catch (e) {
  console.log("Error funding node ", e);
}


ℹ️
Lazy-funding works best when using blockchains like Ethereum and Solana where transactions are finalized quickly.
Fee Multiplier
The multiplier parameter multiplies the fees we allow the network to take, in effect prioritizing the transaction. Normally you can safely ignore this parameter, however, if you're experiencing errors when funding, you can try passing a value of 1.2 or more.
try {
  const irys = await getIrysUploader();
 
  const fundTx = await irys.fund(irys.utils.toAtomic(0.05), 1.2);
  console.log(
    `Successfully funded ${irys.utils.fromAtomic(fundTx.quantity)} ${
      irys.token
    }`
  );
} catch (e) {
  console.log("Error funding node ", e);
}


Paid RPCs
When transferring tokens we use public RPCs. Sometimes these can be slow to confirm transactions. If you're experiencing an error when funding, consider using a paid RPC.
import EthereumNodeIrys from "@irys-network/node-bundler-ethereum";
 
const getIrysUploader = async () => {
  const rpcUrl = "";
  const irysUploader = await Uploader(Ethereum).withWallet(process.env.PRIVATE_KEY).withRpc(rpcUrl);
  return irysUploader;
};


funder.submitFundTransaction(txID)
Tells the network to re-evaluate a funding transaction.
Parameters
Name
Type
Description
txId
string
The ID of the funding transaction to re-evaluate.
Returns
Type
Description
object
A JSON object with the following values.
response = {
	id, // The transaction ID of the fund transfer
	quantity, // How much is being transferred
	reward, // The amount taken by the network as a fee
	target, // The address the funds were sent to
};


Example
ℹ️
Use a token-specific version of getIrysUploader() to connect to an Irys Bundler before uploading. Choose one from here.
const irys = await getIrysUploader();
 
try {
	// First get a receipt
	const fundTx = await irys.fund(irys.utils.toAtomic(0.05));
	const response = await irys.funder.submitFundTransaction(fundTx.id);
 
} catch (e) {
	console.log("Error funding ", e);
}


withdrawBalance(amount)
Withdraws the specified amount from the user's account balance. The unit is the token parameter supplied when creating the Irys object. If you have balances in more than one token, you must re-instantiate the Irys object for each token.
Parameters
Name
Type
Description
amount
BigNumber
The amount to withdraw. Value must be in atomic units.
Returns
Type
Description
string
Either a 400 or 200 code.
400 - something went wrong
response.data = "Not enough balance for requested withdrawal"
 
200 - Ok
response.data = {
	requested, // the requested amount,
	fee, // the reward required by the network (network fee)
	final, // total cost to your account (requested + fee)
	tx-id, // the ID of the withdrawal transaction
}


Example
ℹ️
Use a token-specific version of getIrysUploader() to connect to an Irys Bundler before uploading. Choose one from here.
const irys = await getIrysUploader();
 
try {
	// 1. Get current balance
	const curBalance = await irys.getLoadedBalance();
	// 2. Withdraw all
	const response = await irys.withdrawBalance(curBalance);
	console.log(`Successfully withdrew ${irys.utils.fromAtomic(curBalance)} ${irys.token}`);
} catch (e) {
	console.log("Error uploading data ", e);
}


withdrawAll()
Withdraws the the user's entire account balance. The unit is the token parameter supplied when creating the Irys object. If you have balances in more than one token, you must re-instantiate the Irys object for each token.
Returns
Type
Description
string
Either a 400 or 200 code.
400 - something went wrong
 
200 - Ok
response.data = {
	requested, // the requested amount,
	fee, // the reward required by the network (network fee)
	final, // total cost to your account (requested + fee)
	tx-id, // the ID of the withdrawal transaction
}


Example
ℹ️
Use a token-specific version of getIrysUploader() to connect to an Irys Bundler before uploading. Choose one from here.
try {
	const irys = await getIrysUploader();
	const tx = await irys.withdrawAll();
} catch (e) {
	console.log("Error withdrawing funds ", e);
}


getBalance()
Returns the connected wallet's balance.
Returns
Type
Description
BigNumber
Wallet balance in atomic units. You can convert it into standard units using irys.utils.fromAtomic().
Example
ℹ️
Use a token-specific version of getIrysUploader() to connect to an Irys Bundler before uploading. Choose one from here.
const irys = await getIrysUploader();
 
// Get loaded balance in atomic units
const atomicBalance = await irys.getBalance();
console.log(`Node balance (atomic units) = ${atomicBalance}`);
 
// Convert balance to standard
const convertedBalance = irys.utils.fromAtomic(atomicBalance);
console.log(`Node balance (converted) = ${convertedBalance}`);


getPrice(numBytes)
Returns the cost to upload the specified number of bytes.
Parameters
Name
Type
Description
numBytes
number
The number of bytes to check the price for.
Returns
Type
Description
BigNumber
Cost to upload numBytes, unit is the token specified when instantiating the Irys object. Return value is in atomic units, to convert to standard units use irys.utils.fromAtomic().
Example
ℹ️
Use a token-specific version of getIrysUploader() to connect to an Irys Bundler before uploading. Choose one from here.
const irys = await getIrysUploader();
 
const numBytes = 1048576; // Number of bytes to check
const priceAtomic = await irys.getPrice(numBytes);
 
// Convert from atomic units to standard units
const priceConverted = irys.utils.fromAtomic(priceAtomic);
 
console.log(`Uploading ${numBytes} bytes costs ${priceConverted}`);


upload(data, tags?, anchor?)
Uploads data to Irys.
Parameters
Name
Type
Description
data
string | Buffer | Readable
The data to upload.
tags
Tag[]
(Optional) metatags.
anchor
string
(Optional) Random value used to prevent data item ID collisions, used with deterministic data item IDs only.
Returns
Type
Description
object
A receipt as a JSON object with the following values.
response = {
	id, // Transaction ID (used to download the data)
	timestamp, // Timestamp (UNIX milliseconds) of when the transaction was created and verified
	version, // The version of this JSON file, currently 1.0.0
	public, // Public key of the bundler node used
	signature, // A signed deep hash of the JSON receipt
	deadlineHeight, // The block number by which the transaction must be finalized
	block, // Deprecated
	validatorSignatures, // Deprecated
	verify, // An async function used to verify the receipt at any time
}


Funding
Uploads of less than 100 KiB are are free. For larger uploads, you'll need to fund your account first.
Example
ℹ️
Use a token-specific version of getIrysUploader() to connect to an Irys Bundler before uploading. Choose one from here.
const irys = await getIrysUploader();
 
const dataToUpload = "Hirys world.";
try {
	const receipt = await irys.upload(dataToUpload);
	console.log(`Data uploaded ==> https://gateway.irys.xyz/${receipt.id}`);
} catch (e) {
	console.log("Error uploading data ", e);
}


ℹ️
Use the transaction ID returned as part of the response to download the data by creating a URL in the format https://gateway.irys.xyz/:transactionId.
uploadFile(fileName, tags?)
Uploads a file to Irys.
Parameters
Name
Type
Description
fileName
string
Name of the file to upload.
tags
Tag[]
(Optional) metatags.
Returns
Type
Description
object
A receipt as a JSON object with the following values.
response = {
	id, // Transaction ID (used to download the data)
	timestamp, // Timestamp (UNIX milliseconds) of when the transaction was created and verified
	version, // The version of this JSON file, currently 1.0.0
	public, // Public key of the bundler node used
	signature, // A signed deep hash of the JSON receipt
	deadlineHeight, // The block number by which the transaction must be finalized
	block, // Deprecated
	validatorSignatures, // Deprecated
	verify, // An async function used to verify the receipt at any time
}


Funding
Uploads of less than 100 KiB are are free. For larger uploads, you'll need to fund your account first.
Example
ℹ️
Use a token-specific version of getIrysUploader() to connect to an Irys Bundler before uploading. Choose one from here.
const irys = await getIrysUploader();
 
// Your file
const fileToUpload = "./myImage.png";
 
// Add a custom tag that tells the gateway how to serve this file to a browser
const tags = [{ name: "Content-Type", value: "image/png" }];
 
try {
	const response = await irys.uploadFile(fileToUpload, tags);
	console.log(`File uploaded ==> https://gateway.irys.xyz/${response.id}`);
} catch (e) {
	console.log("Error uploading file ", e);
}


ℹ️
Use the transaction ID returned as part of the response to download the data by creating a URL in the format https://gateway.irys.xyz/:transactionId.
uploadFolder()
Uploads a group of files to Irys in a single transaction.
See:
* NodeJS: For uploading a folder on the server.
* Browser: For uploading a folder from the browser.
Funding
Uploads of less than 100 KiB are are free. For larger uploads, you'll need to fund your account first.
NodeJS
Parameters
Name
Type
Description
folderToUpload
string
Path to the folder being uploaded.
indexFile
string
(Optional) The name of an index file also included in the folder you upload. If provided, this index file will load when a user requests https://gateway.irys.xyz/:manifestId.
batchSize
number
(Optional) The number of files to upload at once.
keepDeleted
boolean
(Optional) Whether to keep now deleted items from previous uploads. When you upload a folder, the file names are indexed and saved. If you then re-upload that same folder, Irys will only upload new files added since the previous upload. In the case where you delete files from your source directory, this flag tells Irys whether to keep those deleted files in the index or remove them.
Returns
Type
Description
object
A JSON object with the following values.
{
	id, // Transaction ID (used to download the data)
	timestamp, // Timestamp (UNIX milliseconds) of when the transaction was created and verified
	version, // The version of this JSON file, currently 1.0.0
	public, // Public key of the bundler node used
	signature, // A signed deep hash of the JSON receipt
	deadlineHeight, // The block number by which the transaction must be finalized
	block, // Deprecated
	validatorSignatures, // Deprecated
	verify, // An async function used to verify the receipt at any time
}


Example
ℹ️
Use a token-specific version of getIrysUploader() to connect to an Irys Bundler before uploading. Choose one from here.
const irys = await getIrysUploader();
 
// Upload an entire folder
const folderToUpload = "./my-images/"; // Path to folder
try {
	const response = await irys.uploadFolder("./" + folderToUpload, {
		indexFile: "", // Optional index file (file the user will load when accessing the manifest)
		batchSize: 50, // Number of items to upload at once
		keepDeleted: false, // Whether to keep now deleted items from previous uploads
	});
 
	console.log(`Files uploaded. Manifest ID ${response.id}`);
} catch (e) {
	console.log("Error uploading file ", e);
}


Browser
Pass an array of File objects.
Parameters
Name
Type
Description
files
TaggedFile[]
Path to the folder being uploaded.
indexFileRelPath
string
(Optional) Your own throwaway JWK to use for signing (i.e if you want to use the same one for more than one set of uploads).
throwawayKey
number
(Optional) The number of files to upload at once.
seperateManifestTx
boolean
(Optional) If true, the manifest transaction will be excluded from the bundle making its tags indexable and queryable.
Returns
Type
Description
object
A JSON object with the following values.
{
	id, // Manifest ID
	timestamp, // Timestamp (UNIX milliseconds) of when the transaction was created and verified
	version, // The version of this JSON file, currently 1.0.0
	public, // Public key of the bundler node used
	signature, // A signed deep hash of the JSON receipt
	deadlineHeight, // The block number by which the transaction must be finalized
	block, // Deprecated
	validatorSignatures, // Deprecated
	verify, // An async function used to verify the receipt at any time
}


Example
const irysUploader = await getIrysUploader();
 
const files: File[] = [];
const tags: { name: string; value: string }[][] = [];
 
// Set files and tags in your UI
 
// Convert to TaggedFile objects
const taggedFiles = files.map((f: TaggedFile, i: number) => {
	f.tags = tags[i];
	return f;
});
 
// Optional parameters
const uploadOptions = {
	indexFileRelPath: "./index.html",
	manifestTags: myTags,
	throwawayKey: myKey,
	seperateManifestTx: true,
};
const response = await irysUploader.uploadFolder(taggedFiles, uploadOptions);


Returns
A JSON object containing the following values. A receipt is also generated which can be retrieved using irys.utils.getReceipt(response.id)
{
	id, // Transaction ID
	manifestId, // Manifest ID
	manifest, // The manifest
    txs, // An array of DataItems, one for each entry in the bundle
	timestamp, // Timestamp (UNIX milliseconds) of when the transaction was created and verified
	version, // The version of this JSON file, currently 1.0.0
	public, // Public key of the bundler node used
	signature, // A signed deep hash of the JSON receipt
	deadlineHeight, // The block number by which the transaction must be finalized
	block, // Deprecated
	validatorSignatures, // Deprecated
	verify, // An async function used to verify the receipt at any time
}


Downloading
Files uploaded via uploadFolder() can be retrieved in one of two ways.
1. Creating a URL with the format https://gateway.irys.xyz/:manifestId/:originalFileName.
2. Creating a URL using the transaction ID of each individual file uploaded with the format https://gateway.irys.xyz/:transactonId
After a successful folder upload, two files are written to your local project directory [folder_name].csv and [folder_name].json. The example below highlights a folder called with a total of 5 files in it. The transaction ID for each file can be used to retrieve the uploaded data by forming a URL with the format https://gateway.irys.xyz]/:transactionId
￼
upload.uploadBundle(tx, bundleOptions?)
Uploads an array of transactions as a bundle in a single transaction.
This function is provided for users who need to obtain each transaction's ID before uploading. However, most users will use uploadFolder(), an abstraction that handles the uploading, signing and bundling in a single function call.
Parameters
Name
Type
Description
data
(DataItem | Buffer | string)[]
An array of transactions to upload
bundleOptions
DataItemCreateOptions
(Optional) Upload options, which includes tags.
Notes
If a provided transaction is unsigned, the transaction is signed using a temporary (throwaway) key. This means transactions can be associated with a single "random" address.
If a buffer is provided, it is converted into a transaction and then signed by the throwaway key. The throwaway key, address, and all bundled (provided + throwaway signed + generated) transactions are returned by this method.
Returns
Type
Description
object
A receipt as a JSON object with the following values.
response = {
	id, // Transaction ID (used to download the data)
	timestamp, // Timestamp (UNIX milliseconds) of when the transaction was created and verified
	version, // The version of this JSON file, currently 1.0.0
	public, // Public key of the bundler node used
	signature, // A signed deep hash of the JSON receipt
	deadlineHeight, // The block number by which the transaction must be finalized
	block, // Deprecated
	validatorSignatures, // Deprecated
	verify, // An async function used to verify the receipt at any time
}


Funding
Uploads of less than 100 KiB are are free. For larger uploads, you'll need to fund your account first.
Tags
You can add an optional array of tags in the BundleOptions object (see code example below)
Example
ℹ️
Use a token-specific version of getIrysUploader() to connect to an Irys Bundler before uploading. Choose one from here.
 
const uploadBundle = async () => {
  const irys = await getIrysUploader();
  const maxTxs = 5;
  const txs = [];
  
  // First create and sign a group of transactions
  for (let i = 0; i < maxTxs; i++) {
    const newTx = await irys.createTransaction(`Hirys World! ${i + 1}`, {
      tags: [{ name: "Content-Type", value: "text/plain" }],
    });
    await newTx.sign(); // ID is now set
    txs.push(newTx);
  }
  
  // Or send an array of Buffers
  // If a Buffer is provided, it is converted into a transaction and then signed by the throwaway key
  // const txs: Buffer[] = [
  //   Buffer.from("This is transaction data 1"),
  //   Buffer.from("This is transaction data 2"),
  // ];
 
  try {
    const options = {
      // throwawayKey: undefined, // Optional, pass a JWK if you have a throwaway key
      bundleOpts: {
        tags: [
          { name: "application-id", value: "foo" }, // Add optional tags
        ],
      } 
    };
    const uploadReceipt = await irys.uploader.uploadBundle(txs, options);
    console.log(`All Txs uploaded.`);
    for (let i = 0; i < uploadReceipt.txs.length; i++) {
      console.log(`https://gateway.irys.xyz/${uploadReceipt.txs[i].id}`)
    }
 
  } catch (e) {
    console.log("Error uploading bundle ", e);
  }
}


ℹ️
The transaction ID returned as part of the response is used to download the data, simply create a URL with the format https://gateway.irys.xyz/:transactionId.
utils.toAtomic(value)
Converts from standard to atomic units.
Parameters
Name
Type
Description
value
BigNumber
The value to be converted.
Returns
Type
Description
BigNumber
The value in atomic units.
Example
ℹ️
Use a token-specific version of getIrysUploader() to connect to an Irys Bundler before uploading. Choose one from here.
const irys = await getIrysUploader();
 
const amountAtomic = irys.utils.toAtomic(amountStandard);


ℹ️
Atomic units refer to the smallest possible unit of a given cryptocurrency. In Ethereum, atomic units are called Wei, and they represent the smallest unit of Ether. Similar to how 1 dollar can be broken down into 100 cents, 1 Ether can be broken down into 10^18 Wei. In Solana, atomic units are called Lamports, 1 SOL can be broken down into 10^9 Lamports.
utils.fromAtomic(value)
Converts from atomic to standard units.
Parameters
Name
Type
Description
value
BigNumber
The value to be converted.
Returns
Type
Description
BigNumber
The value in standard units.
Example
ℹ️
Use a token-specific version of getIrysUploader() to connect to an Irys Bundler before uploading. Choose one from here.
const irys = await getIrysUploader();
 
const atomicBalance = await irys.getLoadedBalance();
const convertedBalance = irys.utils.fromAtomic(atomicBalance).toString();


ℹ️
Atomic units refer to the smallest possible unit of a given cryptocurrency. In Ethereum, atomic units are called Wei, and they represent the smallest unit of Ether. Similar to how 1 dollar can be broken down into 100 cents, 1 Ether can be broken down into 10^18 Wei. In Solana, atomic units are called Lamports, 1 SOL can be broken down into 10^9 Lamports.
utils.getReceipt(transactionId)
Returns the receipt associated with the supplied transaction ID, or an error if no receipt is found.
Parameters
Name
Type
Description
transactionId
string
The transaction ID associated with the receipt.
Returns
Type
Description
object
A receipt in the form of a JSON object with the following values.
response = {
	id, // Transaction ID (used to download the data)
	timestamp, // Timestamp (UNIX milliseconds) of when the transaction was created and verified
	version, // The version of this JSON file, currently 1.0.0
	public, // Public key of the bundler node used
	signature, // A signed deep hash of the JSON receipt
	deadlineHeight, // The block number by which the transaction must be finalized
	block, // Deprecated
	validatorSignatures, // Deprecated
	verify, // An async function used to verify the receipt at any time
}


Example
const irys = await getIrysUploader();
 
try {
	const transactionID = "i9tgbHsr6c1sxryAQ-SLM2rfQAYRuyap7RmGgH28mI4"; // Your transaction ID
	const receipt = await irys.utils.getReceipt(transactionID);
	console.log(receipt);
} catch (e) {
	console.log("Error getting receipt ", e);
}


utils.verifyReceipt(receipt)
Returns true or false, indicating if a receipt is valid or not.
Parameters
Name
Type
Description
receipt
object
The receipt as a JSON object in the following format.
{
    id, // Transaction ID 
    public, // Public key of the bundler node used
    signature, // A signed deep hash of the JSON receipt
    deadlineHeight, // The block number by which the transaction must be finalized
    timestamp, // Timestamp (UNIX milliseconds) of when the transaction was created and verified
    version, // The version of this JSON file, currently 1.0.0
}


Returns
Type
Description
boolean
A true or false value indicating if the receipt is valid.
Example
ℹ️
Use a token-specific version of getIrysUploader() to connect to an Irys Bundler before uploading. Choose one from here.
const irys = await getIrysUploader();
 
try {
	// First get a receipt
	const transactionID = "i9tgbHsr6c1sxryAQ-SLM2rfQAYRuyap7RmGgH28mI4"; // Your transaction Id
	const receipt = await irys.utils.getReceipt(transactionID);
 
	// Then verify it
	const isReceiptValid = await irys.utils.verifyReceipt(receipt);
	console.log(isReceiptValid);
} catch (e) {
	console.log("Error getting receipt ", e);
}


Chunked Uploader
The Chunked Uploader is a fault-tolerant, resumable, stream-based signer and uploader. It allows you to pause and resume uploads, and to do things like create progress bars that show upload progress.
Key Terminology:
* Batch size: the maximum number of chunks to upload at once. Defaults to 5.
* Chunk size: the maximum size of a single chunk. Defaults to 25MB. For those with slower/unstable connections, reducing both should lead to improved reliability. For those with faster connections, increasing both will lead to higher throughput, at the cost of more memory (and CPU).
ℹ️
The default uploder (accessed via irys.upload()) does chunking automatically. You only need to use the Chunked Uploader to access advanced features like pausing and resuming uploads, changing batch size, and changing chunk size.

Connecting
When using the chunking uploader, first create an Irys object and then follow that by requesting the chunked uploader using irys.uploader.chunkedUploader.
ℹ️
The chunkedUploader object reference must be updated before each subsequent upload, it can not be reused.
let irys = await getIrysUploader();
 
let uploader = irys.uploader.chunkedUploader;


ℹ️
Use a token-specific version of getIrysUploader() to connect to an Irys Bundler before uploading. Choose one from here.
Setting upload parameters
setBatchSize() and uploader.setUploadSize()
The default batch size (number of chunks to upload at once) is 5, the default chunk size (maximum chunk size) is 25MB. These values can be changed using the functions uploader.setBatchSize(size) and uploader.setUploadSize(size).
uploader.setBatchSize(10);
 
// Value is in bytes
uploader.setChunkSize(500000);


Data Mode
The chunked uploader has two modes of operation, Data Mode and Transaction Mode. When using data mode do not create a transaction, this will be done automatically for you.
Within Data Mode, you can either upload using:
* A buffer containing the data you want to upload.
* A readable stream pointing to the data you want to upload.
uploader.uploadData()
const transactionOptions = { tags: [{ name: "Content-Type", value: "text/plain" }] };
 
// 1. Upload a Buffer containing just the data you want to upload.
const dataBuffer = Buffer.from("Hirys, world!");
const response = await uploader.uploadData(dataBuffer, transactionOptions);
// The transaction ID (used to query the network) is found in response.data.id
console.log(`Data buffer uploaded ==> https://gateway.irys.xyz/${response.data.id}`);
 
// 2. OR Upload a Readable (stream) pointing to the data
uploader = irys.uploader.chunkedUploader; // Recreate for each transaction
const dataStream = fs.createReadStream("./data.txt");
response = await uploader.uploadData(dataStream, transactionOptions);
console.log(`Read Stream uploaded ==> https://gateway.irys.xyz/${response.data.id}`);


Transaction Mode
Transaction Mode gives you more fine-grained control over the upload workflow. You can create and sign your transaction first, store it, and then upload when it makes the most sense for your application.
uploadTransaction()
uploader = irys.uploader.chunkedUploader; // Recreate for each transaction
const transaction = irys.createTransaction("Hello, world!");
await transaction.sign();
response = await uploader.uploadTransaction(transaction);
console.log(`Transaction mode uploaded ==> https://gateway.irys.xyz/${response.data.id}`);


Controlling the upload
Uploads created with the chunked uploader can be paused and resumed at any time using the functions uploader.pause() and uploader.resume(). For these functions to work, the initial call to uploader.uploadData() or uploader.uploadTransaction() must not be preceded with the await keyword.
To resume an upload from a new uploader instance, you must use the same:
* Token
* Network (testnet)
* Input data
* Configured chunk size
uploader.pause() and uploader.resume()
ℹ️
Use a token-specific version of getIrysUploader() to connect to an Irys Bundler before uploading. Choose one from here.
const irys = await getIrysUploader();
 
// When uploading smaller files, it's common to use the await keyword before
// uploadData() or uploadTransaction(). This causes execution to pause until the file
// is fully uploaded. If you omit await, the upload happens in the background
// and you can use pause and resume as needed.
transaction = irys.createTransaction("Hello, world!");
uploader = irys.uploader.chunkedUploader; // Recreate for each transaction
const upload = uploader.uploadTransaction(transaction);
uploader.pause(); // Pauses the upload
console.log("Upload paused");
uploader.resume(); // Resumes the upload
console.log("Upload resumed");


While the initial call to uploader.uploadData() or uploader.uploadTransaction() should not use the await keyword, you can use it down the line to ensure the upload is complete.
You can call await at ANY TIME to ensure the upload has is complete.
response = await upload;


Expired uploads
Paused uploads will expire after a period of inactivity. If you need to recover an expired upload, use the following:
const resumeData = uploader.getResumeData(); 
uploader.setResumeData(resumeData); 
await uploader.uploadTransaction(dataItem); 


Upload events
The uploader emits three events during each upload. These can be subscribed to for any use case when tracking upload progress is needed.
* chunkUpload: Emitted whenever a chunk is uploaded.
* chunkError: Emitted whenever a chunk upload fails. Due to internal retry logic, these errors can most likely be ignored as long as the upload doesn't error overall.
* done: Emitted when the upload completes.
uploader.on("chunkUpload", (chunkInfo) => {
	console.log(
		`Uploaded Chunk number ${chunkInfo.id}, offset of ${chunkInfo.offset}, size ${chunkInfo.size} Bytes, with a total of ${chunkInfo.totalUploaded} bytes uploaded.`,
	);
});
 
uploader.on("chunkError", (e) => {
	console.error(`Error uploading chunk number ${e.id} - ${e.res.statusText}`);
});
 
uploader.on("done", (finishRes) => {
	console.log(`Upload completed with ID ${finishRes.id}`);
});


Irys in The Browser
The Irys SDK reduces dependency bloat by providing dedicated packages for each token. Your install statements, import and connection code will differ depending on the token used for payment and the provider used.
Choose the code for your provider:
🚀
If you're using Irys with React, follow these extra setup steps. If you're using Irys with Vite, follow these steps.
Ethers v5 | Ethers v6 | Viem v2 | Solana | Aptos
EVM Chains
When connecting from an EVM chain, your connection code will differ based on the token you're using. The examples below use Ethereum and the WebEthereum class. To change tokens, use one from the following list.
Token	Class Name
Polygon	WebMatic
Binance Coin	WebBNB
Avalanche C-Chain	WebAvalanche
Base Ethereum	WebBaseEth
USDC (on Ethereum)	WebUSDCEth
Arbitrum	WebArbitrum
Chainlink	WebChainlink
USDC (on Polygon)	WebUSDCPolygon
Berachain	WebBera
Scroll Ethereum	WebScrollEth
Linea Ethereum	WebLineaEth
IoTeX	WebIotex
Ethereum	WebEthereum
Ethers v5
Installing:
npm install \
    @irys/web-upload \
    @irys/web-upload-ethereum \
    ethers@5


Importing & Configuring:
import { WebUploader } from "@irys/web-upload";
import { WebEthereum } from "@irys/web-upload-ethereum";
 
const getIrysUploader = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const irysUploader = await WebUploader(WebEthereum).withProvider(provider);
 
  return irysUploader;
};


Ethers v6
Installing:
npm install \
    @irys/web-upload \
    @irys/web-upload-ethereum \
    @irys/web-upload-ethereum-ethers-v6 \
    ethers@6


Importing & Configuring:
import { WebUploader } from "@irys/web-upload";
import { WebEthereum } from "@irys/web-upload-ethereum";
import { EthersV6Adapter } from "@irys/web-upload-ethereum-ethers-v6";
import { ethers } from "ethers";
 
const getIrysUploader = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const irysUploader = await WebUploader(WebEthereum).withAdapter(EthersV6Adapter(provider));
 
  return irysUploader;
};


Viem v2
Installing:
npm install \
    @irys/web-upload \
    @irys/web-upload-ethereum \
    @irys/web-upload-ethereum-viem-v2 \
    viem


Importing & Configuring:
import { WebUploader } from "@irys/web-upload";
import { WebEthereum } from "@irys/web-upload-ethereum";
import { ViemV2Adapter } from "@irys/web-upload-ethereum-viem-v2";
 
const getIrysUploader = async () => {
  const [account] = await window.ethereum.request({ method: "eth_requestAccounts",});
 
  const provider = createWalletClient({
    account,
    chain: sepolia,
    transport: custom(window.ethereum),
  });
 
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: custom(window.ethereum),
  });
 
  const irysUploader = await WebUploader(WebEthereum).withAdapter(ViemV2Adapter(provider, { publicClient }));
 
  return irysUploader;
};


Solana
Installing:
npm install \
    @irys/web-upload \
    @irys/web-upload-solana
    @solana/wallet-adapter-base \
    @solana/wallet-adapter-react \
    @solana/wallet-adapter-react-ui \
    @solana/wallet-adapter-wallets \
    @solana/web3.js


Importing & Configuring:
The Solana library uses the React provider pattern. Start by setting up a top-level file named ClientProviders.tsx that wraps all your child components.
app/components/ClientProviders.js
"use client";
 
import { ReactNode, useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
 
require("@solana/wallet-adapter-react-ui/styles.css");
 
export default function ClientProviders({ children }: { children: ReactNode }) {
 const network = WalletAdapterNetwork.Devnet;
 
 const endpoint = useMemo(() => clusterApiUrl(network), [network]);
 const wallets = useMemo(
   () => [new UnsafeBurnerWalletAdapter()],
   [network]
 );
 
 return (
   <ConnectionProvider endpoint={endpoint}>
     <WalletProvider wallets={wallets} autoConnect>
       <WalletModalProvider>
         {children}
       </WalletModalProvider>
     </WalletProvider>
   </ConnectionProvider>
 );
}


Then load this component via layout.tsx:
layout.tsx
import type { Metadata } from "next";
import ClientProviders from "@/app/components/ClientProviders";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
 
export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
   <html lang="en">
     <body className={inter.className}>
       <ClientProviders>
         {children}
       </ClientProviders>
     </body>
   </html>
 );
}


Solana's wallet-adapter library
(opens in a new tab)
 make it easy to manage wallet connections. Create a component using this library to connect to a Solana wallet:
app/components/ConnectSolana.tsx
 
"use client";
 
import React, { useEffect, useState } from "react";
import { WalletMultiButton, WalletDisconnectButton } from "@solana/wallet-adapter-react-ui";
 
import "@solana/wallet-adapter-react-ui/styles.css";
 
const ConnectSolana: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
 
  // Prevent hydration errors by ensuring this runs only on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);
 
  if (!isClient) {
    return null;
  }
 
  return (
    <div className="border-2 border-primary rounded-2xl p-4 w-full max-w-md">
      {/* Solana wallet connect button */}
      <div className="mr-5">
        <WalletMultiButton />
      </div>
      {/* Solana wallet disconnect button */}
      <div className="ml-5">
        <WalletDisconnectButton />
      </div>
    </div>
  );
};
 
export default ConnectSolana;


Then create a component called ConnectIrys.tsx that connects to an Irys bundler.
app/components/ConnectIrys.tsx
 
"use client";
 
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WebUploader } from "@irys/web-upload";
import { WebSolana } from "@irys/web-upload-solana";
  
const getIrysUploader = async (wallet: any) => {
 try {
   const irysUploader = await WebUploader(WebSolana).withProvider(wallet);
    
   return irysUploader; 
 } catch (error) {
   console.error("Error connecting to Irys:", error);
   throw new Error("Error connecting to Irys");
 }
};
 
const ConnectIrys = (): JSX.Element => {
 const wallet = useWallet();
 const [isConnected, setIsConnected] = useState<boolean>(false);
 
 const connectToIrys = async () => {
   if (!wallet) {
     console.log("Wallet not connected");
     return;
   }
 
   try {
     const irysUploader = await getIrysUploader(wallet);
     console.log(`Connected to Irys from ${irysUploader.address}`);
     setIsConnected(true);
   } catch (error) {
     console.log("Error connecting to Irys");
   }
 };
 
 return (
   <div>
     <button onClick={connectToIrys}>
       {isConnected ? "Connected to Irys" : "Connect Irys"}
     </button>
   </div>
 );
};
 
export default ConnectIrys;


And load them all through your page.tsx file:
page.tsx
import Image from "next/image";
import ConnectSolana from "./components/ConnectSolana";
import ConnectIrys from "./components/ConnectIrys";
 
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-around items-center p-24 bg-black">
      <ConnectSolana />
      <ConnectIrys />
    </main>
  );
}


Aptos
Start by scaffolding a blank Aptos project using npx create-aptos-dapp
(opens in a new tab)
.
Next, install the following packages needed by Irys:
npm install \
    @irys/web-upload \
    @irys/web-upload-aptos \
    axios


Replace your App.tsx file with the following:
import React, { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WebUploader } from "@irys/web-upload";
import { WebAptos } from "@irys/web-upload-aptos";
 
// Radix UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
 
function App() {
  const { connected } = useWallet();
  const wallet = useWallet();
  const [irysStatus, setIrysStatus] = useState("Not connected");
 
  const connectIrys = async () => {
    console.log("connect irys called");
    console.log({wallet})
    try {
      const irysUploader = await WebUploader(WebAptos).withProvider(wallet);
      console.log({irysUploader})
 
      setIrysStatus(`Connected to Irys: ${irysUploader.address}`);
    } catch (error) {
      console.error("Error connecting to Irys:", error);
      setIrysStatus("Error connecting to Irys");
    }
  };
 
  return (
    <>
      <Header />
      <div className="flex items-center justify-center flex-col">
        <Card className="mt-6">
          <CardHeader>
            {connected ? (
              <CardTitle>
                <button onClick={connectIrys}>
                  {irysStatus === "Not connected" ? "Connect Irys" : irysStatus}
                </button>
              </CardTitle>
            ) : (
              <CardTitle>To get started, connect a wallet</CardTitle>
            )}
          </CardHeader>
        </Card>
      </div>
    </>
  );
}
 
export default App;
 


The npx create-aptos-dapp CLI uses React + Vite. Vite does not automatically polyfill Node.js core modules like crypto, stream, os, or path. To fix compatibility issues, install the necessary polyfill packages:
npm install --save-dev \
    crypto-browserify \
    stream-browserify \
    os-browserify \
    path-browserify \
    vite-plugin-node-polyfills


Modify your vite.config.js to use vite-plugin-node-polyfills to handle the polyfills required for Node.js core modules:
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
 
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Enable polyfills for specific globals and modules
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true, // Polyfill node: protocol imports
    }),
  ],
  resolve: {
    alias: {
      // Polyfill Node.js core modules
      crypto: "crypto-browserify",
      stream: "stream-browserify",
      os: "os-browserify/browser",
      path: "path-browserify",
      "@": path.resolve(__dirname, "./frontend"), 
    },
  },
  build: {
    outDir: "dist", // Output directory
  },
  server: {
    open: true, 
  },
});


After making these changes, restart your development server:
npm run dev


Installation
Install using npm with the -g global flag.
npm i -g @irys/cli


Depending on your setup, you may need to use the sudo command.
sudo npm i -g @irys/cli


ℹ️
If you get an error while installing, append the --force flag to the end of the above command.
balance
Returns the amount of funds available on the specified node. Provide your public wallet address as an argument, along with:
Parameters
Option
Description
-n
The network to check, testnet or devnet, defaults to testnet.
-t
The token to use when funding.
--provider-url
RPC URL to use.
Examples
Testnet
irys balance 0x591B5Ce7cA10a55A9B5d1516eF89693D5b3586b8 \
  -t ethereum 


Devnet
irys balance 0x591B5Ce7cA10a55A9B5d1516eF89693D5b3586b8 \
  -t ethereum \
  -n devnet \
  --provider-url https://rpc.sepolia.dev


ℹ️
RPC URLs change often, use a recent one from https://chainlist.org/
(opens in a new tab)
  price
Checks the price to upload the specified number of bytes.
Parameters
Option
Description
-n
The network to check, testnet or devnet, defaults to testnet.
-t
The token to use when funding.
--provider-url
RPC URL to use.
Examples
Testnet
irys price 1000000 \
  -t ethereum 


Devnet
irys price 1000000 \
  -t ethereum \
  -n devnet \
  --provider-url https://rpc.sepolia.dev


ℹ️
RPC URLs change often, use a recent one from https://chainlist.org/
(opens in a new tab)
  fund
Fund Irys with the specified amount of tokens.
ℹ️
Not all calls to fund will post immediately to your account, some blockchains are faster than others.
Parameters
Option
Description
-n
The network to check, testnet or devnet, defaults to testnet.
-t
The token to use when funding.
-w
Your private key.
--provider-url
RPC URL to use.
Examples
Testnet
irys fund 1000000000000000 \
  -t ethereum \
  -w bf20......c9885307 


Devnet
irys fund 1000000000000000 \
  -n devnet \
  -t ethereum \
  -w bf20......c9885307 \
  --provider-url https://rpc.sepolia.dev


ℹ️
RPC URLs change often, use a recent one from https://chainlist.org/
(opens in a new tab)
 


withdraw
Withdraws funds from Irys.
ℹ️
Not all calls to withdraw will post immediately to your account, some blockchains are faster than others.
Parameters
Option
Description
-n
The network to check, testnet or devnet, defaults to testnet.
-t
The token to use when funding.
-w
Your private key.
--provider-url
RPC URL to use.
Examples
Testnet
irys withdraw 1000000000000000 \
  -t ethereum \
  -w bf20......c9885307 


Devnet
irys withdraw 1000000000000000 \
  -n testnet \
  -t ethereum \
  -w bf20......c9885307 \
  --provider-url https://rpc.sepolia.dev


ℹ️
RPC URLs change often, use a recent one from https://chainlist.org/
(opens in a new tab)
 


upload
Uploads a single file.
Parameters
Option
Description
-n
The network to check, testnet or devnet, defaults to testnet.
-t
The token to use when funding.
-w
Your private key.
--tags
Tags to include, format <name> <value>.
--provider-url
RPC URL to use.
Examples
Testnet
irys upload myImage.png \
  -t ethereum \
  -w bf20......c9885307 \
  --tags tagName1 tagValue1 tagName2 tagValue2 


Devnet
irys upload myImage.png \
  -n devnet \
  -t ethereum \
  -w bf20......c9885307 \
  --tags tagName1 tagValue1 tagName2 tagValue2 \
  --provider-url https://rpc.sepolia.dev


ℹ️
RPC URLs change often, use a recent one from https://chainlist.org/
(opens in a new tab)
Downloading
Files uploaded via irys upload can be downloaded using the transaction ID provided after a successful upload.
irys upload myImage.png \
  -n testnet \
  -t aptos \
  -w bf20......c9885307 \
  --tags tagName1 tagValue1 tagName2 tagValue2
 
Loaded address: 0xac568a981b1370b2e1baa8ce30bd5ac9e28c572d
Uploaded to https://gateway.irys.xyz/yPX6_rwxfJ_2gTvXSHGoumIvlFR-EwuRlUMmHpeLHUM



upload-dir
Uploads an entire directory of files.
Parameters
Option
Description
-n
The network to check, testnet or devnet, defaults to testnet.
-t
The token to use when funding.
-w
Your private key.
--index-file
Name of the file to use as an index for manifests.
--provider-url
RPC URL to use.
Examples
Testnet
irys upload-dir ./myImages \
  -t ethereum \
  -w bf20......c9885307 


Devnet
irys upload-dir ./myImages \
  -n devnet \
  -t ethereum \
  -w bf20......c9885307 \
  --provider-url https://rpc.sepolia.dev


ℹ️
RPC URLs change often, use a recent one from https://chainlist.org/
(opens in a new tab)
Downloading
Files uploaded via irys upload-dir can be retrieved in one of two ways.
1. Creating a URL with the format https://gateway.irys.xyz/manifestId/:originalFileName].
2. Creating a URL using the transaction ID of each individual file uploaded with the format https://gateway.irys.xyz/:transactonId
After a successful folder upload, two files are written to your local project directory:
* [folder_name].csv
* [folder_name].json
The example below highlights a folder called with a total of 5 files in it. The transaction ID for each file can be used to retrieve the uploaded data by forming a URL with the format https://gateway.irys.xyz]/transactionId
￼




General API
These routes query the Irys Labs bundler for general status information.
GET
/info
Info route


GET
/public
Get public information


GET
/status
Get status


Account API
These routes query the Irys Labs bundler for account details, such as retrieving account balances.
GET
/account/balance/{token}
Get user balance for token


GET
/account/approval
Get approval information


POST
/account/withdraw
Withdraw user balance


GET
/account/withdrawals/{token}
Get withdrawals for token


GET
/account/withdrawals
Get all withdrawals


Price API
This route queries the Irys Labs bundler to determine the cost to upload a set number of bytes.
GET
/price/{token}/{size}
Get price for token and size


Transaction API
These routes post new transactions to the Irys Labs bundler and also query the bundler for information about transactions.
POST
/tx
Post transaction


POST
/tx/{token}
Post transaction


HEAD
/tx/{txId}/data
Get transaction data


GET
/tx/{txId}/data
Get transaction data


GET
/tx/{txId}/status
Get transaction status


GET
/tx/{txId}/tags
Get transaction tags


GET
/tx/{txId}
Get transaction metadata


Chunk API
These routes are for posting chunks to the Irys Labs bundler and querying for information about posted chunks.
POST
/chunks/{token}/{txid}/{offset}
Upload chunk


GET
/chunks/{token}/{txid}/{offset}
Get chunk


Using Irys With npx create-react-app
ℹ️
If you're using React with Vite, polyfills are handled differently. You'll need to follow this guide instead.
Irys is fully compatible with React, however, if you’re using npx create-react-app to create your project, you will need to do some additional configuration and installation. This guide details how to create a new React project and add Irys support. If you already have a React project, skip the first step.
Step 1: Create a New React Project
Create a new directory for your project, cd into it, and create your React project:
mkdir irys-react
cd irys-react
npx create-react-app .


Step 2: Install the Irys SDK, Ethers, and Axios
npm install \
    @irys/web-upload \
    @irys/web-upload-ethereum \
    @irys/web-upload-ethereum-ethers-v6 \
    ethers@6 \
    axios


Step 3: Initialize the Irys Uploader
In your App.js file, write an initialization function that sets up an Irys uploader. The following code shows how to use ethers6. We also have code examples for different providers.
import React, { useState } from "react";
import { ethers } from "ethers";
import { WebUploader } from "@irys/web-upload";
import { WebEthereum } from "@irys/web-upload-ethereum";
import { EthersV6Adapter } from "@irys/web-upload-ethereum-ethers-v6";
 
function App() {
  const [walletStatus, setWalletStatus] = useState("Not connected");
  const [irysStatus, setIrysStatus] = useState("Not connected");
 
  const connectWallet = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletStatus(`Connected: ${address}`);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      setWalletStatus("Error connecting to wallet");
    }
  };
 
  const connectIrys = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const irysUploader = await WebUploader(WebEthereum).withAdapter(EthersV6Adapter(provider));
      setIrysStatus(`Connected to Irys: ${irysUploader.address}`);
    } catch (error) {
      console.error("Error connecting to Irys:", error);
      setIrysStatus("Error connecting to Irys");
    }
  };
 
  return (
    <div>
      <button onClick={connectWallet}>Connect Wallet</button>
      <p>{walletStatus}</p>
      <button onClick={connectIrys}>Connect Irys</button>
      <p>{irysStatus}</p>
    </div>
  );
}
 
export default App;


When you try to run the app, you see this similar to this BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.
To fix this, you'll need to include Node.js polyfills that are not included by default.
Step 4: Install React-App-Rewired and Polyfills
Install react-app-rewired, a package that allows you to customize the Webpack configuration to handle the polyfills, and the missing dependencies:
npm install react-app-rewired
npm install --save-dev crypto-browserify stream-browserify assert stream-http https-browserify os-browserify url buffer process
npm install browserify-zlib path-browserify path
npm install node-polyfill-webpack-plugin --save-dev


Step 5: Create the Webpack Configuration Override
At the root level of your project, create a new file called config-overrides.js and paste the following:
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const webpack = require("webpack");
 
module.exports = function override(config) {
  config.plugins = (config.plugins || []).concat([
    new NodePolyfillPlugin(),
    new webpack.ProvidePlugin({
      process: "process/browser.js", 
    }),
  ]);
 
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    assert: require.resolve("assert"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    os: require.resolve("os-browserify"),
    url: require.resolve("url"),
    zlib: require.resolve("browserify-zlib"),
    buffer: require.resolve("buffer"),
    path: require.resolve("path-browserify"),
  });
 
  config.resolve.fallback = fallback;
  config.resolve.extensions = [".js", ".jsx", ".json", ".mjs", ".wasm", ".css"];
 
  return config;
};


Step 6: Update package.json Scripts
Modify your package.json to use the new Webpack configuration. Look for this code block:
 "scripts": {
   "start": "react-scripts start",
   "build": "react-scripts build",
   "test": "react-scripts test",
   "eject": "react-scripts eject"
 },


and replace it with this block:
"scripts": {
   "start": "react-app-rewired start",
   "build": "react-app-rewired build",
   "test": "react-app-rewired test",
   "eject": "react-scripts eject"
},


Step 7: Restart Your React App
Quit the React development server if it's running and restart it:
npm start


You should now be good to go! Your React app is set up with all necessary polyfills and is ready to use the Irys SDK.
Using Irys With React + Vite
This guide covers how to set up an Irys project using React + Vite.
Step 1: Setup a New Project
Create a new directory for your project, navigate into it, and initialize it with Vite:
mkdir irys-vite
cd irys-vite
npm create vite@latest .


Choose React and select either TypeScript or JavaScript.
After selecting the framework, run:
npm install


Step 2: Install the Irys SDK, Ethers, and Axios
Install the necessary packages, including the Irys SDK, Ethers, and Axios:
npm install \
    @irys/web-upload \
    @irys/web-upload-ethereum \
    @irys/web-upload-ethereum-ethers-v6 \
    ethers@6 \
    axios


Step 3: Initialize the Irys Uploader
In your App.tsx file, write an initialization function to set up an Irys uploader using Ethers v6:
import { useState } from "react";
import { ethers } from "ethers";
import { WebUploader } from "@irys/web-upload";
import { WebEthereum } from "@irys/web-upload-ethereum";
import { EthersV6Adapter } from "@irys/web-upload-ethereum-ethers-v6";
 
function App() {
  const [walletStatus, setWalletStatus] = useState("Not connected");
  const [irysStatus, setIrysStatus] = useState("Not connected");
 
  const connectWallet = async () => {
    console.log("connect wallet");
 
    if (typeof window.ethereum === 'undefined') {
      console.error("No Ethereum provider found. Please install MetaMask or another wallet.");
      setWalletStatus("No Ethereum provider found. Please install MetaMask or another wallet.");
      return;
    }
 
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletStatus(`Connected: ${address}`);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      setWalletStatus("Error connecting to wallet");
    }
  };
 
  const connectIrys = async () => {
    if (typeof window.ethereum === 'undefined') {
      console.error("No Ethereum provider found. Please install MetaMask or another wallet.");
      setIrysStatus("No Ethereum provider found. Please install MetaMask or another wallet.");
      return;
    }
 
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const irysUploader = await WebUploader(WebEthereum).withAdapter(EthersV6Adapter(provider));
      setIrysStatus(`Connected to Irys: ${irysUploader.address}`);
    } catch (error) {
      console.error("Error connecting to Irys:", error);
      setIrysStatus("Error connecting to Irys");
    }
  };
 
  return (
    <div>
      <button onClick={connectWallet}>Connect Wallet</button>
      <p>{walletStatus}</p>
      <button onClick={connectIrys}>Connect Irys</button>
      <p>{irysStatus}</p>
    </div>
  );
}
 
export default App;


Step 4: Install Node Polyfills for Vite
Vite does not automatically polyfill Node.js core modules like crypto, stream, os, or path. To fix compatibility issues, install the necessary polyfill packages:
npm install --save-dev \
    crypto-browserify \
    stream-browserify \
    os-browserify \
    path-browserify \
    vite-plugin-node-polyfills


Step 5: Update vite.config.js
Modify your vite.config.js to use vite-plugin-node-polyfills to handle the polyfills required for Node.js core modules:
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
 
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Enable polyfills for specific globals and modules
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true, // Polyfill node: protocol imports
    }),
  ],
  resolve: {
    alias: {
      // Polyfill Node.js core modules
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      os: 'os-browserify/browser',
      path: 'path-browserify',
    },
  },
});


Step 6: Restart Vite Development Server
After making these changes, restart your development server:
npm run dev


Your React + Vite project should now be set up correctly to use the Irys SDK and handle all necessary Node.js polyfills.



Storing DePIN Data on Irys
DePIN networks need a reliable data layer they can trust.
Imagine a network of nodes signing and reporting data onchain and a smart contract that reads this data to mint rewards. This setup only works if the DePIN protocol can easily verify that miners are storing the data they claim to store and that the data hasn’t been tampered with after being uploaded. Additionally, DePIN networks need to chronologically order data so they can process it in the order it was posted.
Irys makes this possible with permanent onchain data storage and upload receipts with millisecond-accurate timestamps. Protocols can verify data is stored by miners, ensure it remains unaltered, and sequence it.
Data on Irys can be accessed by protocols on any blockchain.
Example
This guide includes example code showing how to store DePIN messages on Irys, how to tag and query those messages, and how to order them chronologically.
ℹ️
Data messages for DePIN networks vary, but the core principles of secure storage, retrieval, and verification remain consistent across different use cases.
Device Data
Example data for a weather sensor.
{
  "device_id": "foo_device_001",
  "timestamp": "2024-08-29T12:34:56Z",
  "data": {
    "temperature": 22.5,
    "humidity": 60,
    "battery_level": 85,
    "location": {
      "latitude": 37.7749,
      "longitude": -122.4194
    }
  },
  "signature": "a4f8a2e8e7c4d2a7c3e1f9b6d8e2f1a0c5b7e6a3c4d1f7b8e2a6c1d3e7f8b9c2"
}


You can upload your DePIN data to Irys using the Irys CLI:
irys upload depin_data.json \
  -n testnet \
  -t ethereum \
  -w 6dd5e....54a120201cb6a \
  --tags Content-Type application/json \


Or through the Irys SDK:
ℹ️
Use a token-specific version of getIrysUploader() to connect to an Irys Bundler before uploading. Choose one from here.
 
const uploadDePINData = async () => {
	const irys = await getIrysUploader();
 
	const fileToUpload = "./depin_data.json";
	const tags = [{ name: "Content-Type", value: "application/json" }];
 
	try {
		const response = await irys.uploadFile(fileToUpload, { tags: tags });
		console.log(`File uploaded ==> https://gateway.irys.xyz/${response.id}`);
	} catch (e) {
		console.log("Error uploading file ", e);
	}
};


Using Tags
Irys supports adding metadata tags to each upload, allowing you to categorize data and make it easily searchable. For DePIN networks, tags like device-id, data-type, location, and application-id can be attached to each upload. This makes it simple to filter data by criteria important to your network.
Example Tags
Here’s how you might tag a data upload:
* device-id: "foo_device_001"
* data-type: "temperature"
* location: "San Francisco, CA"
* application-id: "DePIN Network Alpha"
const uploadDePINData = async () => {
	const irys = await getIrysUploader();
 
	const fileToUpload = "./depin_data.json";
	const tags = [{ name: "Content-Type", value: "application/json" },
                { name: "device-id", value: "foo_device_001" },
                { name: "data-type", value: "temperature" },
                { name: "location", value: "San Francisco, CA" },
                { name: "application-id", value: "DePIN Network Alpha" }];
 
	try {
		const response = await irys.uploadFile(fileToUpload, { tags: tags });
		console.log(`File uploaded ==> https://gateway.irys.xyz/${response.id}`);
	} catch (e) {
		console.log("Error uploading file ", e);
	}
};


Querying
To query data stored on Irys, you can use GraphQL to search for specific tags and order the results by timestamp:
query getDeviceTemperatureData {
  transactions(tags: [
    { name: "device-id", values: ["foo_device_001"] },
    { name: "data-type", values: ["temperature"] },
    { name: "location", values: ["San Francisco, CA"] },
    { name: "application-id", values: ["DePIN Network Alpha"] }
  ], order: ASC) {
    edges {
      node {
        id
        tags {
          name
          value
        }
        timestamp
      }
    }
  }
}


This query retrieves all temperature data from foo_device_001 located in San Francisco, and orders the results by the upload timestamp.
By using tags and timestamps, you can ensure your DePIN network maintains accurate data sequencing and retrieval across any blockchain.



Storing AI Prompts on Irys
Permanently storing AI prompts and their results is crucial for creating a reliable audit trail. Irys enables this through permanent-onchain storage and signed receipts containing millisecond-accurate timestamps.
This guarantees that each stored prompt is verifiable and immutable.
This is essential for:
1. Intellectual Property (IP) Protection: Having a precise record of the input and output can help resolve disputes over IP rights, proving that the content generated was based on specific inputs used against a specific model.
2. Model Evolution and Accountability: AI models are continuously updated and retrained, meaning their outputs can change over time (even when given the same prompt). By storing prompts along with metadata, you can trace back the specific conditions under which an AI output was generated.
3. Compliance and Transparency: Regulatory requirements around AI are evolving, and organizations may soon need to demonstrate how and why specific AI-generated content was created.
ℹ️
There is currently no universally accepted standard for representing AI prompts; this guide is based on best practices outlined in OpenAI's documentation.
Key Elements to Store
To store AI prompts, the following elements should be captured:
* Prompt Text: The actual text of the prompt given to the AI model.
* Timestamp: The date and time when the prompt was executed.
* Model Used: The AI model used (e.g., GPT-4, DALL-E 2).
* Result: The output generated by the AI, or a hash of the output.
* Hashing Algorithm: If storing a hash of the result, indicate the algorithm used (e.g., SHA-256).
In certain cases, the following will be needed too:
* Parameters: Parameters such as temperature, max_tokens, and stop_sequences.
* Custom Metadata: Additional metadata that might be relevant, such as purpose, user ID, or application context.
This can be represented as a JSON object:
prompt.json
{
  "prompt_text": "Translate this text from Esperanto to Toki Pona.",
  "created_at": "2024-08-29T15:30:00Z",
  "model": "gpt-4",
  "temperature": 0.7,
  "max_tokens": 150,
  "stop_sequences": ["\n"],
  "metadata": {
    "purpose": "Translation",
    "user_id": "12345"
  },
  "result": {
    "type": "text",
    "output": "kama ante e toki pi jan Esperanto tawa toki pona.",
    "hash": "9a6e38d09ca3e6a8f2f4d1d6234c1a762c3e8a9d",
    "hash_algo": "SHA-256"
  }
}


Storing Results or Hashes
It's not always possible to store the full output generated by the AI prompt. For larger outputs, such as images or videos, storing a hash of the result is more efficient.
ℹ️
Hashing provides a lightweight way to verify the output. A hash is a fixed-length string of characters generated from data of any size, used to verify the integrity of that data by ensuring it hasn't been altered.
{
  "prompt_text": "Generate an image of the coolest mascot in the universe.",
  "created_at": "2024-08-29T15:30:00Z",
  "model": "dall-e-2",
  "temperature": 0.8,
  "max_tokens": 0,
  "stop_sequences": [],
  "metadata": {
    "purpose": "Image generation",
    "user_id": "12345"
  },
  "result": {
    "type": "image",
    "url": "https://gateway.irys.xyz/sprite.png",
    "hash": "8c14d8a15f5e7a6d1a9a23387cd5eebc1d2c9e8f",
    "hash_algo": "SHA-256"
  }
}


Uploading the JSON Object to Irys
You can store the JSON object containing the prompt using the Irys CLI:
irys upload myPrompt.json \
  -n testnet \
  -t ethereum \
  -w 6dd5e....54a120201cb6a \
  --tags Content-Type application/json \
  --provider-url https://sepolia.base.org


Or SDK:
ℹ️
Use a token-specific version of getIrysUploader() to connect to an Irys Bundler before uploading. Choose one from here.
const uploadMetadata = async () => {
	const irys = await getIrysUploader();
 
	const fileToUpload = "./myPrompt.json";
	const tags = [{ name: "Content-Type", value: "application/json" }];
 
	try {
		const response = await irys.uploadFile(fileToUpload, { tags: tags });
		console.log(`File uploaded ==> https://gateway.irys.xyz/${response.id}`);
	} catch (e) {
		console.log("Error uploading file ", e);
	}
};


Once your prompt is stored onchain with Irys, you have'll have a permanent record of what was executed and when.



Monitor Node Balance With A Script
Irys's upfront funding simplifies uploading data by allowing you to pre-fund your uploads. This eliminates the need for individual funding calls for each upload as the loaded balance is automatically deducted from with each upload. To keep track of your loaded balance, users commonly create scripts that periodically check their balance and provide notifications when it approaches zero.
This guide offers examples of how to monitor your balance using:
* JavaScript
* Command Line Interface (CLI)
* cURL.
These three techniques are all equally effective options.
JavaScript
ℹ️
The following getIrysUploader() function is for using the Ethereum token only, we also have examples covering all of the tokens we support for payment.
import EthereumNodeIrys from "@irys-network/node-bundler-ethereum";
import dotenv from "dotenv";
dotenv.config();
 
const getIrysUploader = async () => {
  const irysClient  = await EthereumNodeIrys().withWallet(process.env.PRIVATE_KEY);
 
  console.log(`Connected to Irys from ${irysClient.address}`);
  return irysClient;
};
 
const checkBalance = async () => {
	const irys = await getIrysUploader();
 
	// Get loaded balance in atomic units
	const atomicBalance = await irys.getLoadedBalance();
	// Convert balance to standard units
	const convertedBalance = irys.utils.fromAtomic(atomicBalance);
	return convertedBalance;
};
 
const checkAndPrintBalance = async () => {
	const balance = await checkBalance();
	const threshold = 0.1; // 10% threshold
 
	if (Math.abs(balance) <= threshold) {
		console.log(`Balance ${balance} is within 10% of 0, please fund.`);
	} else {
		console.log(`Balance ${balance} funding not yet needed.`);
	}
};
 
// Call the function immediately
checkAndPrintBalance();
 
// Then repeat every 30 minutes
setInterval(checkAndPrintBalance, 30 * 60 * 1000);


CLI
You can achieve the same thing using our CLI and a bash script. The advantage to doing it this way is you’re not connecting to Irys, which means you don’t need to provide your private key. Using your wallet’s public address, the script calls our CLI’s irys balance command, parses the output and tests if it’s close to 0.
#!/bin/bash
 
# Define your variables
address="0xaC568a981B1370B2e1bAA8cE30BD5AC9E28C572D" # Public wallet address
# RPC URLs change often, use a recent one from https://chainlist.org/
provider_url="https://rpc.sepolia.dev"
node_address="https://testnet.irys.xyz"
token="ethereum"
balance_output="";
 
# Check if node_address contains "testnet"
# When using testnet, you must also include a provider-url
if [[ $node_address == *"testnet"* ]]; then
   balance_output=$(irys balance $address --provider-url $provider_url -h $node_address -c $token)
else
   balance_output=$(irys balance $address -h $node_address -t $token)
fi
 
# Use regex to parse the output and assign the parsed value to a variable
parsed_balance=$(echo $balance_output | awk -F'[()]' '{split($2,a," "); print a[1]}')
 # Define your threshold
threshold=0.1
 
# Check if parsed_balance is within threshold of 0
is_close_to_zero=$(echo "$parsed_balance < $threshold" | bc -l)
 
if [ $is_close_to_zero -eq 1 ]; then
   echo "Balance ${parsed_balance} is within $(echo "$threshold*100" | bc -l)% of 0, please fund."
else
   echo "Balance ${parsed_balance} funding not yet needed"
fi


To run a bash script periodically, use cron. Assuming you saved the above script as a file checkBalance.sh, open up your crontab file using crontab -e and then add an entry to call the script periodically. To call it every 30 minutes, you’d add the following:
*/30 * * * * /path/to/your/script/checkBalance.sh
cURL
A third option is to make cURL request using a URL with the following format https://<node-address>/account/balance/<token>?address=<address>. For example to check the MATIC balance of the wallet with address 0xaC568a981B1370B2e1bAA8cE30BD5AC9E28C572D, you would use the command https://testnet.irys.xyz/account/balance/matic?address=0xaC568a981B1370B2e1bAA8cE30BD5AC9E28C572D
Just as with our CLI, you don’t need to provide your private key. This version is also more streamlined than the CLI version as you don’t need to include the provider URL when checking the Devnet balances.
#!/bin/bash
 
# Define your variables
address="0xaC568a981B1370B2e1bAA8cE30BD5AC9E28C572D" # Public wallet address
node_address="https://testnet.irys.xyz"
token="token"
balance_output="";
 
# Create the API endpoint URL
balance_check_url="${node_address}/account/balance/${token}?address=${address}"
 
# Make the cURL request and capture the response
balance_output=$(curl -s "$balance_check_url")
 
# Parse the balance from the response using awk
parsed_balance=$(echo "$balance_output" | awk -F'"' '{print $4}')
 
# Define the decimal factor for conversion (this works for MATIC and others with 18 decimals)
decimal_factor=1000000000000000000
 
# For Solana currencies with 9 decimals, use
# decimal_factor=1000000000
 
# Convert parsed_balance to standard units
balance_in_standard_units=$(awk -v parsed_balance="$parsed_balance" -v decimal_factor="$decimal_factor" 'BEGIN{printf "%.18f", parsed_balance/decimal_factor}')
 
# Define your threshold in standard units
threshold=0.1
 
# Check if balance_in_standard_units is within a threshold of 0
is_close_to_zero=$(awk -v balance="$balance_in_standard_units" -v threshold="$threshold" 'BEGIN{if(balance < threshold) print 1; else print 0}')
 
if [ $is_close_to_zero -eq 1 ]; then
   echo "Balance ${balance_in_standard_units} is within $(echo "$threshold*100" | bc -l)% of 0, please fund."
else
   echo "Balance ${balance_in_standard_units} funding not yet needed"
fi


To run a bash script periodically, use cron. Assuming you saved the above script as a file checkBalance.sh, open up your crontab file using crontab -e and then add an entry to call the script periodically. To call it every 30 minutes, you’d add the following:
*/30 * * * * /path/to/your/script/checkBalance.sh




Uploading NFTs to Irys
When you use Irys to store NFT assets, you’re guaranteed your NFT will be both permanent and immutable. Here’s how you do it.
NFT Assets
￼
There are three parts to an NFT:
1. Smart contract
2. NFT metadata
3. NFT assets
The smart contract stores a pointer to the NFT metadata, and then the NFT metadata contains links to the NFT assets.
In the example above, there is a name and description that are shown on platforms like Opensea when the NFT is viewed. The image parameter points to a static image of the NFT. You can also add an optional animation_url that points to a video, song, or HTML animation file.
Creating an NFT
Three steps to creating an NFT:
1. Upload your assets to Irys.
2. Embed the URLs to the assets in NFT metadata.
3. Upload metadata to Irys.
4. Use the metadata URL to mint your NFT.
Uploading Assets (SDK)
After installing the Irys SDK, upload your assets with:
ℹ️
Use a token-specific version of getIrysUploader() to connect to an Irys Bundler before uploading. Choose one from here.
import * as fs from "fs";
 
const uploadImage = async () => {
	const irys = await getIrysUploader();
	const fileToUpload = "./myNFT.png";
 
	// Get size of file
	const { size } = await fs.promises.stat(fileToUpload);
	// Get cost to upload "size" bytes
	const price = await irys.getPrice(size);
	console.log(`Uploading ${size} bytes costs ${irys.utils.fromAtomic(price)} ${token}`);
	await irys.fund(price);
 
	// Upload metadata
	try {
		const response = await irys.uploadFile(fileToUpload);
		console.log(`File uploaded ==> https://gateway.irys.xyz/${response.id}`);
	} catch (e) {
		console.log("Error uploading file ", e);
	}
};


Uploading Assets (CLI)
Alternatively, you can upload using our Storage CLI.
irys upload myNFT.png \
  -n testnet \
  -t ethereum \
  -w bf20......c9885307 \
  --tags Content-Type image/png \
  --provider-url https://rpc.sepolia.dev


Creating Metadata
Embed the URLs generated from the above into your NFT metadata.
{
	"name": "My NFT",
	"symbol": "MNFT",
	"description": "To the moooooonnnn",
	"image": "https://gateway.irys.xyz/737m0bA1kW4BlIJOg_kOGUpHAAI-3Ec9bdo8S_xTFKI",
}


Uploading Metadata (SDK)
Finally, upload your NFT metadata to Irys and use the URL generated to mint the NFT.
import { Uploader } from "@irys/upload";
import * as fs from "fs";
 
const uploadMetadata = async () => {
	const irys = await getIrysUploader();
 
	const fileToUpload = "./metadata.json";
	const tags = [{ name: "Content-Type", value: "application/json" }];
 
	// Get size of file
	const { size } = await fs.promises.stat(fileToUpload);
	// Get cost to upload "size" bytes
	const price = await irys.getPrice(size);
	console.log(`Uploading ${size} bytes costs ${irys.utils.fromAtomic(price)} ${token}`);
	await irys.fund(price);
 
	// Upload metadata
	try {
		const response = await irys.uploadFile(fileToUpload, { tags: tags });
		console.log(`File uploaded ==> https://gateway.irys.xyz/${response.id}`);
	} catch (e) {
		console.log("Error uploading file ", e);
	}
};


Uploading Metadata (CLI)
Alternatively, you can upload using our Storage CLI.
irys upload metadata.json \
  -n testnet \
  -t ethereum \
  -w bf20......c9885307 \
  --tags Content-Type application/json \
  --provider-url https://rpc.sepolia.dev



Dynamic NFTs
Dynamic NFTs are NFTs whose metadata evolves over time. They are commonly used in:
* Gaming projects where in-game assets evolve as players progress.
* Loyalty programs where NFTs evolve as users accumulate points.
￼
In this guide, you'll create a SuperMon NFT that evolves during gameplay. The NFT starts with a basic appearance and can be "upgraded" twice. You will use the Irys Storage CLI to update the metadata, simulating the automatic changes that would occur through player interactions in an actual game.
Mutable references
Mutable references are a way to simulate "mutability".
1. You start uploading a single transaction. This becomes the head of your transaction chain:
ℹ️
Use a token-specific version of getIrysUploader() to connect to an Irys Bundler before uploading. Choose one from here.
const irys = await getIrysUploader();
const receiptOne = await irys.upload("First TX");
console.log(`TX 1 uploaded https://gateway.irys.xyz/mutable/${receiptOne.id}`);


1. The chain can be updated at any time, and the original URL will always resolve to the most recent one. To "update" the chain, post a new transaction tagged with the transaction ID of the root transaction.
const tags = [{ name: "Root-TX", value: receiptOne.id }];
const receiptTwo = await irys.upload("Second TX", { tags: tags });
console.log(`TX 2 uploaded https://gateway.irys.xyz/mutable/${receiptOne.id}`);


ℹ️
When building a transaction chain, additions must be made using the same wallet that created the original transaction. This prevents unauthorized actors from maliciously modifying someone else’s transaction chain.
Setup
In this guide, you will build on the Base L2. Before starting, make sure you add Base Sepolia to your EVM wallet
(opens in a new tab)
, pre-load some Base Sepolia
(opens in a new tab)
 tokens, and export your private key.
ℹ️
While this guide uses Base Sepolia, the principles outlined can be adapted for deployment on any blockchain.
Smart Contract
You're building an NFT, which means you need a smart contract. Here's a simple one you can use to mint the NFT you'll create.
SuperMon.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
 
// Import OpenZeppelin's ERC721 and ERC721URIStorage contracts
// These URLs are compatible with Remix IDE
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
 
contract SuperMon is ERC721URIStorage {
    uint256 private _tokenIdCounter;
 
    // No arguments in the constructor, the owner will be the contract deployer
    constructor() ERC721("SuperMon", "SMON") {
        _tokenIdCounter = 0;
    }
 
    // Mint function to create a new NFT
    function mint(address to, string memory uri) public {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter += 1;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }
}


To deploy the smart contract using Remix IDE:
1. Open Remix IDE(opens in a new tab) .
2. Create a new Solidity file
* In the File Explorers pane, click on the Create New File icon.
* Name your file SuperMon.sol, and paste the smart contract in.
1. Compile the contract
* Click on the Solidity Compiler icon in the sidebar.
* Select the compiler version that matches your contract's pragma (^0.8.0).
* Click Compile SuperMon.sol.
1. Deploy the Contract
* Click on the Deploy & Run Transactions icon in the sidebar.
* In the ENVIRONMENT dropdown, select Injected Web3.
* MetaMask will prompt you to connect. Confirm the connection to your Remix session.
* Ensure SuperMon is selected in the CONTRACT dropdown.
* Click Deploy. MetaMask will ask for confirmation to proceed with the transaction.
Uploading the Images
￼
￼
￼
Right-click on each of the above images and save them on your local drive.
Next, fund the Irys Testnet with 0.1 Sepolia ETH to pay for your uploads.
ℹ️
In all of these CLI examples, make sure to replace the value of the -w parameter with your own private key.
irys fund 100000000000000000 \
  -n testnet \
  -t base-eth \
  -w 6dd5e....54a120201cb6a \
  --provider-url https://sepolia.base.org


ℹ️
The fund command accepts a value in atomic units, 0.1 ETH is equal to 100000000000000000 in atomic units.
Next, use the Irys Storage CLI to upload each of the images to Irys.
irys upload image-level-1.png \
  -n testnet \
  -t base-eth \
  -w 6dd5e....54a120201cb6a \
  --tags Content-Type image/png \
  --provider-url https://sepolia.base.org
 
irys upload image-level-2.png \
  -n testnet \
  -t base-eth \
  -w 6dd5e....54a120201cb6a \
  --tags Content-Type image/png \
  --provider-url https://sepolia.base.org
 
irys upload image-level-3.png \
  -n testnet \
  -t base-eth \
  -w 6dd5e....54a120201cb6a \
  --tags Content-Type image/png \
  --provider-url https://sepolia.base.org


Uploading the Metadata
Create three metadata files similar to the ones below. Make sure to change the value of the image field to match the URLs generated in the previous step.
metadata-level-1.json
{
  "name": "SuperMon",
  "symbol": "SMON",
  "image": "https://gateway.irys.xyz/QH3rksVhbFg5L9vvjGzb4POUibCEG-TGPInmofp-O-o",
  "description": "Super dooper, changing shapes, changing power",
  "attributes": [
    {
      "trait_type": "supermon-level",
      "value": "1"
    }
  ]
}


metadata-level-2.json
{
  "name": "SuperMon",
  "symbol": "SMON",
  "image": "https://gateway.irys.xyz/QH3rksVhbFg5L9vvjGzb4POUibCEG-TGPInmofp-O-o",
  "description": "Super dooper, changing shapes, changing power",
  "attributes": [
    {
      "trait_type": "supermon-level",
      "value": "2"
    }
  ]
 
}


metadata-level-3.json
{
  "name": "SuperMon",
  "symbol": "SMON",
  "image": "https://gateway.irys.xyz/QH3rksVhbFg5L9vvjGzb4POUibCEG-TGPInmofp-O-o",
  "description": "Super dooper, changing shapes, changing power",
  "attributes": [
    {
      "trait_type": "supermon-level",
      "value": "3"
    }
  ]
 
}


And upload just the first file using the Irys CLI.
irys upload metadata-level-1.json \
  -n testnet \
  -t base-eth \
  -w 6dd5e....54a120201cb6a \
  --tags Content-Type application/json \
  --provider-url https://sepolia.base.org


The CLI will return a URL similar to https://gateway.irys.xyz/NDtKvjlmZL2iXUPmX6P-BuvtnvAEFkUiQWG8ToyK5FM. To convert that to a mutable references URL, interpolate it by adding /mutable/ after the domain and before the transaction ID.
Your final URL will be similar to https://gateway.irys.xyz/mutable/NDtKvjlmZL2iXUPmX6P-BuvtnvAEFkUiQWG8ToyK5FM.
Mint the NFT
To mint your NFT in Remix:
1. Return to Remix.
2. Under "Deployed Contracts", locate your contract and expand it to see its functions.
3. Under the Mint function, enter the wallet address you want to mint the NFT to and the metadata URL (e.g. https://gateway.irys.xyz/mutable/NDtKvjlmZL2iXUPmX6P-BuvtnvAEFkUiQWG8ToyK5FM) from the previous step.
4. Click Transact.
￼
You can now view the NFT on the Opensea Testnet
(opens in a new tab)
.
Mutating the Metadata
To now "mutate" the NFT, upload a new version of the metadata tagging it as having a Root-TX equal to the transaction ID of your first transaction. In my example, I pass the value of NDtKvjlmZL2iXUPmX6P-BuvtnvAEFkUiQWG8ToyK5FM, however make sure to change this to match your unique transaction ID.
irys upload metadata-level-2.json \
  -n devnet \
  -t base-eth \
  -w 6dd5e....54a120201cb6a \
  --tags Content-Type application/json Root-TX NDtKvjlmZL2iXUPmX6P-BuvtnvAEFkUiQWG8ToyK5FM \
  --provider-url https://sepolia.base.org


Return to Opensea and request that it refresh your metadata.
￼
Give it a few minutes and your updated NFT should be visible.
Free Metadata Uploads
On Irys uploads of less than 100 KiB are free, which is more than enough for most metadata files. This means projects can let users "evolve" their NFTs without having to pay gas fees.
Caching
Wallets and NFT platforms typically cache metadata to optimize performance, this can affect the visibility of updates to dynamic NFTs. While OpenSea offers a feature for users to manually request metadata refreshes, not all platforms provide this level of control. When building dynamic NFT projects, make sure to thoroughly test and understand the implications of caching on your platform.
Getting Help
Any questions? Reach out to us in Discord
(opens in a new tab)
.


Encrypting Onchain Data With Lit Protocol
Use Lit Protocol
(opens in a new tab)
 with Irys to securely encrypt and manage your onchain data.
Why This Matters
Using Lit with Irys empowers developers with the ability to create innovative applications by combining secure, encrypted data with the power of data storage and execution.
Lit Protocol
Lit
(opens in a new tab)
 is a decentralized key management network for signing and encryption. Users can encrypt data and set custom decryption rules, such as owning specific NFTs, maintaining an ERC20 token balance, or any other logic they define.
Irys
Once encrypted, data can be uploaded onchain, offering guaranteed retrieval for as long as needed — whether for days or permanently. Only users who meet the defined decryption rules can access the data, making it ideal for secure and private use cases.
Unlocking New Possibilities For Developers
This opens up new use cases for builders, such as:
* Gating access to content
* Storing and securing private DePIN data
* Securely archiving sensitive AI data
* Encrypted content for decentralized social apps
* Decentralized identity verification
* Creating private data marketplaces
* Creating exclusive NFTs
Encrypting Data
￼
There are three steps to encrypting data:
1. Obtain a wallet signature (AuthSig), which proves you own a wallet
2. Define access control conditions for who can decrypt your data
3. Connect to a Lit node and request that it encrypt your data
Decrypting Data
￼
There are three steps to decrypting data:
1. Obtain a wallet signature (AuthSig), which proves you own a wallet
2. Retrieve data stored on Irys
3. Connect to a Lit node and request that it decrypt your data
Examples
This guide covers integrating Lit with Irys, both with Node.js on the server and React/Next.js in the browser.
Node.js
When working with Node.js, provide a private key when encrypting and decrypting data.
The full code for this example is available in the GitHub repository
(opens in a new tab)
. Users who prefer learning by example can start there.
Installing
npm install \
  @lit-protocol/lit-node-client-nodejs \
  @lit-protocol/constants \
  @irys/upload \
  @irys/upload-ethereum \
  ethers \
  siwe \
  dotenv


Connecting to Lit Protocol
Connect to a Lit node on one of its active networks
(opens in a new tab)
. Choose between Datil (mainnet), Datil-test (testnet), and Datil-dev (development). For this example, we'll use DatilDev as use is free and not rate-limited.
import * as LitJsSdk from "@lit-protocol/lit-node-client-nodejs";
import { LitNetwork } from "@lit-protocol/constants";
 
let litNodeClientInstance: LitJsSdk.LitNodeClientNodeJs | null = null;
 
async function getLitNodeClient(): Promise<LitJsSdk.LitNodeClientNodeJs> {
  if (litNodeClientInstance) return litNodeClientInstance;
 
  litNodeClientInstance = new LitJsSdk.LitNodeClientNodeJs({
    alertWhenUnauthorized: false,
    litNetwork: LitNetwork.DatilDev, // DatilDev network for free usage
    debug: false,
  });
 
  await litNodeClientInstance.connect();
  return litNodeClientInstance;
}


Setting Access Control Rules
Access control rules determine who can decrypt your data. Set conditions based on criteria like ETH or ERC20 balance, NFT ownership, or custom logic.
ETH Balance
ERC20 Balance
ERC721 Ownership
// Allow users with ≥ 0 ETH:
function getAccessControlConditions(): object[] {
  return [
    {
      contractAddress: "",
      standardContractType: "",
      chain: "ethereum",
      method: "eth_getBalance",
      parameters: [":userAddress", "latest"],
      returnValueTest: {
        comparator: ">=",
        value: "000000000000000000", // 0 ETH in wei
      },
    },
  ];
}




For more advanced examples, see unified access control conditions
(opens in a new tab)
.
Encrypting Data
Lit Protocol provides multiple methods to encrypt data, including strings, files, zip files.
* encryptString(): Encrypts a string.
* encryptToJson(): Encrypts a string or file and serializes the result to JSON.
* zipAndEncryptString(): Encrypts and compresses a string into a zip file. Useful for bundling multiple pieces of data.
* encryptFile() and zipAndEncryptFiles(): Encrypt a single file or multiple files.
We will use encryptString() to encrypt a simple string:
async function encryptData(dataToEncrypt: string): Promise<[string, string]> {
  const authSig = await getAuthSig();
  const accessControlConditions = getAccessControlConditions();
  const litNodeClient = await getLitNodeClient();
 
  const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
    { accessControlConditions, dataToEncrypt },
    litNodeClient
  );
 
  return [ciphertext, dataToEncryptHash];
}


The encryptString() function encrypts your data according to the specified access control conditions, and returns:
* ciphertext: The encrypted string.
* dataToEncryptHash: The hash of the original string, ensuring data integrity.
Storing Data on Irys
When storing encrypted data on Irys, store it as a JSON object with three components:
* ciphertext: The encrypted version of your data.
* dataToEncryptHash: A hash of the original data, which helps verify its integrity during decryption.
* accessControlConditions: The rules governing who can decrypt the data.
async function storeOnIrys(cipherText: string, dataToEncryptHash: string): Promise<string> {
  const irysUploader = await getIrysUploader();
 
  const dataToUpload = {
    cipherText,
    dataToEncryptHash,
    accessControlConditions: getAccessControlConditions(),
  };
 
  try {
    const tags = [{ name: "Content-Type", value: "application/json" }];
    const receipt = await irysUploader.upload(JSON.stringify(dataToUpload), { tags });
    return receipt?.id || "";
  } catch (error) {
    console.error("Error uploading data: ", error);
    return "";
  }
}


Downloading Data from Irys
To retrieve your stored data, use the transaction ID returned at upload.
async function retrieveFromIrys(id: string): Promise<[string, string, object[]]> {
  const gatewayAddress = "https://gateway.irys.xyz/";
  const url = `${gatewayAddress}${id}`;
 
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to retrieve data for ID: ${id}`);
    const data = await response.json();
 
    return [data.cipherText, data.dataToEncryptHash, data.accessControlConditions];
  } catch (error) {
    console.error("Error retrieving data: ", error);
    return ["", "", []];
  }
}


Decrypting Data
Use the decryptToString() function to decrypt the data. This requires the ciphertext, its hash, access control conditions, and session signatures.
async function decryptData(
  ciphertext: string,
  dataToEncryptHash: string,
  accessControlConditions: object[]
): Promise<string> {
  const litNodeClient = await getLitNodeClient();
 
  const sessionSigs = await litNodeClient.getSessionSigs({
    chain: "ethereum",
    resourceAbilityRequests: [
      {
        resource: new LitAccessControlConditionResource("*"),
        ability: LitAbility.AccessControlConditionDecryption,
      },
    ],
    authNeededCallback: async (params: any) => {
      const toSign = await createSiweMessageWithRecaps({
        uri: params.uri,
        expiration: params.expiration,
        resources: params.resourceAbilityRequests,
        walletAddress: await (await new ethers.Wallet(process.env.PRIVATE_KEY!)).getAddress(),
        nonce: await litNodeClient.getLatestBlockhash(),
        litNodeClient,
      });
 
      return await generateAuthSig({
        signer: new ethers.Wallet(process.env.PRIVATE_KEY!),
        toSign,
      });
    },
  });
 
  const decryptedString = await LitJsSdk.decryptToString(
    {
      accessControlConditions,
      chain: "ethereum",
      ciphertext,
      dataToEncryptHash,
      sessionSigs,
    },
    litNodeClient
  );
 
  return decryptedString;
}


Next.js
When working with Lit in the browser, the private key will be linked via the user's wallet extension.
The full code for this example, including a complete UI, is available in the GitHub repository
(opens in a new tab)
. This guide focuses on the functions which handle interactions with Lit Protocol and Irys, but does not cover how to build and setup a UI.
Installing
npm install \
  @lit-protocol/lit-node-client \
  @irys/web-upload \
  @irys/web-upload-ethereum \
  @irys/web-upload-ethereum-ethers-v6 \
  ethers


Connecting to Lit Protocol
Connect to a Lit node on one of its active networks
(opens in a new tab)
. Choose between Datil (mainnet), Datil-test (testnet), and Datil-dev (development). For this example, we'll use DatilDev as use is free and not rate-limited.
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
 
const litClient = new LitNodeClient({
  litNetwork: "datil-dev",
});


Setting Access Control Rules
Access control
(opens in a new tab)
 rules determine who can decrypt your data. Set conditions based on criteria like ETH or ERC20 balance, NFT ownership, or custom logic.
ETH Balance
ERC20 Balance
ERC721 Ownership
// Allow users with ≥ 0 ETH:
function getAccessControlConditions(): object[] {
  return [
    {
      contractAddress: "",
      standardContractType: "",
      chain: "ethereum",
      method: "eth_getBalance",
      parameters: [":userAddress", "latest"],
      returnValueTest: {
        comparator: ">=",
        value: "000000000000000000", // 0 ETH in wei
      },
    },
  ];
}




For more advanced examples, see unified access control conditions
(opens in a new tab)
.
Encrypting Data
Lit Protocol provides multiple methods to encrypt data, including strings, files, zip files.
* encryptString(): Encrypts a string.
* encryptToJson(): Encrypts a string or file and serializes the result to JSON.
* zipAndEncryptString(): Encrypts and compresses a string into a zip file. Useful for bundling multiple pieces of data.
* encryptFile() and zipAndEncryptFiles(): Encrypt a single file or multiple files.
We will use encryptString() to encrypt a string:
export const encryptString = async (text: string): Promise<{ ciphertext: string; dataToEncryptHash: string }> => {
  await litClient.connect();
 
  const accessControlConditions = getAccessControlConditions();
 
  const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
    {
      accessControlConditions,
      dataToEncrypt: text,
    },
    litClient
  );
 
  console.log({ ciphertext, dataToEncryptHash });
  return { ciphertext, dataToEncryptHash };
};


The encryptString() function encrypts your data according to the specified access control conditions, and returns:
* ciphertext: The encrypted string.
* dataToEncryptHash: The hash of the original string, ensuring data integrity.
Storing Data on Irys
When storing encrypted data on Irys, store it as JSON objet with three components:
* ciphertext: The encrypted version of your data.
* dataToEncryptHash: A hash of the original data, which helps verify its integrity during decryption.
* accessControlConditions: The rules governing who can decrypt the data.
export const uploadToIrys = async (cipherText: string, dataToEncryptHash: string): Promise<string> => {
  const irysUploader = await getIrysUploader();
 
  const dataToUpload = {
    cipherText: cipherText,
    dataToEncryptHash: dataToEncryptHash,
    accessControlConditions: getAccessControlConditions(),
  };
 
  try {
    const tags = [{ name: "Content-Type", value: "application/json" }];
    const receipt = await irysUploader.upload(JSON.stringify(dataToUpload), { tags });
    return receipt?.id ? `${gatewayAddress}${receipt.id}` : "";
  } catch (error) {
    console.error("Error uploading data: ", error);
    throw error;
  }
};


Downloading Data from Irys
To retrieve your stored data, you can use the transaction ID returned during the upload.
export const downloadFromIrys = async (id: string): Promise<[string, string, object[]]> => {
  const url = `${gatewayAddress}${id}`;
 
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to retrieve data for ID: ${id}`);
    const data = await response.json();
 
    const ciphertext = data.cipherText;
    const dataToEncryptHash = data.dataToEncryptHash;
 
    return [ciphertext, dataToEncryptHash, data.accessControlConditions];
  } catch (error) {
    console.error("Error retrieving data: ", error);
    return ["", "", []];
  }
};


Decrypting Data
Use the decryptToString() function to decrypt the data. This requires the ciphertext, its hash, access control conditions, and session signatures.
export const decryptData = async (encryptedText: string, dataToEncryptHash: string): Promise<string> => {
  await litClient.connect();
 
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const walletAddress = await signer.getAddress();
 
  const latestBlockhash = await litClient.getLatestBlockhash();
 
  const authNeededCallback = async (params: any) => {
    if (!params.uri) throw new Error("uri is required");
    if (!params.expiration) throw new Error("expiration is required");
    if (!params.resourceAbilityRequests) throw new Error("resourceAbilityRequests is required");
 
    const toSign = await createSiweMessageWithRecaps({
      uri: params.uri,
      expiration: params.expiration,
      resources: params.resourceAbilityRequests,
      walletAddress: walletAddress,
      nonce: latestBlockhash,
      litNodeClient: litClient,
    });
 
    const authSig = await generateAuthSig({
      signer: signer,
      toSign,
    });
 
    return authSig;
  };
 
  const litResource = new LitAccessControlConditionResource("*");
 
  const sessionSigs = await litClient.getSessionSigs({
    chain: "ethereum",
    resourceAbilityRequests: [
      {
        resource: litResource,
        ability: LitAbility.AccessControlConditionDecryption,
      },
    ],
    authNeededCallback,
  });
 
  const decryptedString = await LitJsSdk.decryptToString(
    {
      accessControlConditions: getAccessControlConditions(),
      chain: "ethereum",
      ciphertext: encryptedText,
      dataToEncryptHash,
      sessionSigs,
    },
    litClient
  );
 
  return decryptedString;
};


Getting Help
Any questions? Reach out to us in Discord
(opens in a new tab)
.


Downloading Data
Once data is uploaded, it becomes instantly accessible via our gateway. To download data, make a GET request.
URL format
https://gateway.irys.xyz/:transactionId
Example
https://gateway.irys.xyz/CO9EpX0lekJEfXUOeXncUmMuG8eEp5WJHXl9U9yZUYA
ℹ️
Irys is currently in alpha testnet. At mainnet launch, all data uploaded to bundlers will be migrated from testnet to mainnet, with no changes to transaction IDs.



Querying With GraphQL
You can query Irys transaction metadata using GraphQL.
GraphQL Clients
You can query using an HTTP library like fetch or axios, or use specialized clients like Apollo Client
(opens in a new tab)
 or urql
(opens in a new tab)
.
Endpoint
https://uploader.irys.xyz/graphql
(opens in a new tab)
Anatomy of a Query
A GraphQL query is made up of:
* Query Arguments: Specify search parameters, limit the number of results returned, or enable pagination.
* Results Fields: Fields that define the data you want to retrieve.
￼
Query Arguments
Any of the following query arguments can be used as search parameters:
Field	Description
ids	An array of transaction IDs passed as strings. Values are ORed together, matching results will include transactions that have any of the supplied IDs.
owner	The address used when posting the transaction. Can be a native address from any of the chains supported by Irys. Note in results fields, this is referred to as address.
token	The token used to pay for the transaction.
tags	An array of tag name / value pairs passed as JSON objects.
Results Fields
When building a query, any of the following values be included in your results:
	
	
	
	
	
Field	Description
id	The transaction ID.
GraphQL Sandbox
Clicking on the endpoint URL
(opens in a new tab)
 above will take you to the GraphQL Sandbox used for building and testing queries. Press Control+Space at any time to see an interactive popup window of either query arguments or results fields.
￼
Sample Queries
Queries return transaction metadata. To then retrieve data, use the returned transaction ID and download the data from the Irys gateway using a URL formed as follows:
https://gateway.irys.xyz/:transactionId.
Transaction IDs
Search by transaction IDs.
query getByIds {
	transactions(ids: ["--52WQHJIJod_rni8pkl1Vxt9MFGoXZAm8SC7ex6C1o", "--52THRWpX_RJzGcNXmtQ2DSP37d1e1VQ4YmvbY5ZXo"]) {
		edges {
			node {
				id
				tags {
					name
					value
				}
			}
		}
	}
}


Timestamps
Search by timestamps:
query getByTimestamp {
	transactions(timestamp: { from: 1688144401000, to: 1688317201000 }) {
		edges {
			node {
				id
			}
		}
	}
}


ℹ️
Irys timestamps are accurate to the millisecond, so you need to provide a timestamp in millisecond format when querying. You can convert from human-readable time to UNIX timestamp using websites like Epoch101
(opens in a new tab)
, be sure to convert in millisecond format, not second.
Owners
Search for transactions matching the wallet address used when posting the transaction:
query getByOwner {
	transactions(owners: ["0xBcb812C6e26F4F0F78Bd7B6222461FF24F2942AE", "0xaC568a981B1370B2e1bAA8cE30BD5AC9E28C572D"]) {
		edges {
			node {
				id
				address
			}
		}
	}
}


Tags
Search for transactions matching tag name / value pairs:
query getAllPNGs {
	transactions(tags: [{ name: "Content-Type", values: ["image/png"] }]) {
		edges {
			node {
				id
				address
			}
		}
	}
}


Search for transactions matching the tag with name Content-Type and the values of image/png OR image/jpg:
query getTagsWithOR {
	transactions(tags: [{ name: "Content-Type", values: ["image/png", "image/jpg"] }]) {
		edges {
			node {
				tags {
					name
					value
				}
			}
		}
	}
}


Search for transactions matching the tag with name Content-Type and the values of image/png AND image/jpg:
query getTagsWithAnd {
	transactions(
		tags: [{ name: "Content-Type", values: ["image/jpg"] }, { name: "Content-Type", values: ["image/png"] }]
	) {
		edges {
			node {
				tags {
					name
					value
				}
			}
		}
	}
}


Limiting Results
Limit the number of results returned by including the limit parameter:
query getAllPNGs {
	transactions(limit: 10, tags: [{ name: "Content-Type", values: ["image/png"] }]) {
		edges {
			node {
				id
				address
			}
		}
	}
}


Pagination
You can request a maximum of 100 results returned from each query, to obtain additional results use pagination.
When using pagination you:
1. Retrieve the cursor field, this acts like a bookmark in the search results you can then return to.
2. Use saved cursor value to obtain subsequent search results.
The following query returns 10 transactions tagged image/png occurring after the cursor with value: LS02d1NsM3R6aUprd3dKUzVjN1FXaWg5aUxsbXh5dVJJbGlydHJtNlpPbw. To then obtain the next 10 transactions, use the final cursor value returned from this query as the value of the after parameter in the following query.
query getPNGs {
	transactions(
		limit: 10
		tags: [{ name: "Content-Type", values: ["image/png"] }]
		after: "LS02d1NsM3R6aUprd3dKUzVjN1FXaWg5aUxsbXh5dVJJbGlydHJtNlpPbw"
	) {
		edges {
			node {
				id
			}
			cursor
		}
	}
}


Sorting
You can sort results by timestamp in either ascending or descending order using the order field.
query getAllByOwnerAsc {
	transactions(owners: ["0xBcb812C6e26F4F0F78Bd7B6222461FF24F2942AE"], order: ASC) {
		edges {
			node {
				id
				address
			}
		}
	}
}


query getAllByOwnerDesc {
	transactions(owners: ["0xBcb812C6e26F4F0F78Bd7B6222461FF24F2942AE"], order: DESC) {
		edges {
			node {
				id
				address
			}
		}
	}
}



Troubleshooting
Troubleshooting common errors during installation and use.
Errors:
* bigint: Failed to load bindings, pure JS will be used (try npm run rebuild?)
* Error: Not enough balance for transaction
* Error: Transaction simulation failed: Blockhash not found
bigint
Error message: bigint: Failed to load bindings, pure JS will be used (try npm run rebuild?)
This error can be safely ignored, it will not cause any issues. To make the error go away, you'll need to install updated Python and C++ build tools.
MacOS
Current versions of MacOS come pre-built with Python. To install the C++ build tools:
* First install XCode(opens in a new tab)
* Once XCode is installed, go to Preferences, Downloads, and install the Command Line Tools
Windows
Windows users need to install both Python and C++ build tools. These commands must be run with administrator permissions.
// First run:
npm i -g --add-python-to-path --vs2015 --production windows-build-tools
 
// Then run:
npm i -g node-gyp@latest


UNIX
Most UNIX distributions come with Python installed. To install C++ build tools, the following works for most Debian-based systems. For others, use your package manager to install "GCC build tools".
sudo apt-get install build-essential


Insufficient Balance
Error message: Error: Not enough balance for transaction
This error occurs when you try to upload to a node without first funding it.
Tokens for use on our testnet can be obtained for free from common faucets like the ones for Solana
(opens in a new tab)
 and Sepolia
(opens in a new tab)
.
Blockhash Not Found
Error message: Error: Transaction simulation failed: Blockhash not found
Irys depends on transactions being confirmed, however, in some situations, it may be necessary to wait for the transaction to be finalized.
This can be fixed by configuring Irys as follows:
const irys = new Irys({
	url: nodeUrl,
	token,
	provider,
	config: { tokenOpts: { commitment: "finalized" } },
});


Migrating to the Irys L1
The Irys testnet is now live with support for permanent data uploads, and temporary data support coming soon. In the coming weeks, we’ll also introduce the IrysVM
(opens in a new tab)
 and Programmable Data
(opens in a new tab)
. Irys provides early access to all these new features for developers building on our platform.
At mainnet launch, all data uploaded to bundlers will be migrated from testnet to mainnet, with no changes to transaction IDs.
ℹ️
If you're not ready to migrate yet, you do not have to do anything. Irys's bundlers and gateway for Arweave will continue to operate as normal.
How to Migrate
The new Irys Bundler SDK reduces dependency bloat by providing dedicated packages for each token. Previously, Irys used a single import statement and connection code regardless of token, with our new SDK, code is unique per token.
Migrating your code is simple and straight-forward.
NodeJS
Change This:
import Irys from "@irys/sdk";
 
const getIrys = async () => {
	const irys = new Irys({
		network: "mainnet", 
		token: "ethereum",
		key: process.env.PRIVATE_KEY, 
	});
	return irys;
};


To This:
import { Uploader } from "@irys/upload";
import { Ethereum } from "@irys/upload-ethereum";
 
const getIrysUploader = async () => {
  const irysUploader = await Uploader(Ethereum).withWallet(process.env.PRIVATE_KEY);
  return irysUploader;
};


ℹ️
The above code is for ethereum only, we also have examples covering all supported tokens.
Browser
Change This:
import { WebIrys } from "@irys/sdk";
import { ethers } from "ethers";
 
const getWebIrys = async () => {
	await window.ethereum.enable();
	const provider = new providers.Web3Provider(window.ethereum);
	const wallet = { rpcUrl: rpcUrl, name: "ethersv5", provider: provider };
	const webIrys = new WebIrys({ network: "mainnet", token: "ethereum", wallet });
	await webIrys.ready();
 
	return webIrys;
};


To This:
import { WebUploader } from "@irys/web-upload";
import { WebEthereum } from "@irys/web-upload-ethereum";
import { EthereumEthersv5 } from "@irys/web-upload-ethereum-ethers-v5";
 
const getIrysUploader = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const irysUploader = await WebUploader(WebEthereum).withProvider(EthereumEthersv5(provider));
  return irysUploader;
};


ℹ️
The above code is for ethereum with ethers v5 only, we also have examples covering all supported tokens and providers.
Support
Need help or just have questions? Come find us in Discord
(opens in a new tab)
.
Our alpha testnet is live!
With our testnet live you can store data directly on the L1, build apps with IrysVM and Programmable Data
IrysVM
As a fork of the Ethereum Virtual Machine (EVM), the Irys Virtual Machine (IrysVM) leverages the unique capabilities of the Irys blockchain by integrating access to its advanced storage layer, unlocking the potential for Programmable Data.
Programmable Data
Programmable Irys unlocks a new paradigm where data can be actively used and manipulated in real-time by smart contracts. With Programmable Data, Irys integrates cost-effective data storage and smart-contract functionality, enabling dApps and services to interact programmatically with large amounts of onchain data within a single protocol and ecosystem. This streamlines development, lowers costs, and unlocks unprecedented composability, overcoming the limitations of fragmented integrations.
Quickstart
This covers how to make use of Irys's @irys/js package, but you can also use all EVM compatible tooling for developing apps on Irys.
Install
yarn install @irys/js


Grab some tokens!
The testnet faucet can be found here
(opens in a new tab)
Create the client
const irysClient = await new IrysClient("https://testnet-rpc.irys.xyz/v1")


Get your Irys address
ℹ️
Irys uses the same private keys as Ethereum
const { irys: irysAddress } = irysClient.account.getAddresses("private key") 


For more information about addresses, see Addresses
Check your balance
const balancemIrys = await irysClient.account.getBalance("address") // you can use either your Irys or execution address!


This gets your balance in mIrys (mini-irys), which you can think of as our version of wei
Create and post a data transaction
// Create a transaction
const tx = irysClient.createTransaction({...}) // the args are optional
 
// Generates merkle tree for the data
await tx.prepareChunks(<data>);
 
// Check the price (in mIrys) for uploading your transaction.
// Irys transactions have two fees, a term and a perm fee. 
// perm is only for if you want to store your data permanently (i.e ledger 0)
// Testnet currently only supports `perm` transactions.
 
const { termFee, permFee } = await tx.getFees();
 
// get the combined fee
const fee = await tx.getFee();
 
// Sign the transaction with your private key
const signedTx = await tx.sign(<key>);
 
// Upload the transaction header
await signedTx.uploadHeader();
 
// Upload the data
await signedTx.uploadChunks(<data>);


Connecting to the testnet
Network RPC
Node: testnet-rpc.irys.xyz
(opens in a new tab)
Wallet: wallet.irys.xyz
(opens in a new tab)
Explorer: testnet-explorer.irys.xyz
(opens in a new tab)
The chain is EVM compatible so you can use all standard EVM tooling including Metamask. The network also has custom endpoints for all datachain related activity.
Chain info
Ticker: IRYS Atomic unit: mIRYS (mini IRYS) Decimals: 18 Chain ID: 1270 EVM compatible JSON-RPC URL: https://testnet-rpc.irys.xyz/v1/execution-rpc
(opens in a new tab)
Connecting with Ethers
const irysClient = await new IrysClient("https://testnet-rpc.irys.xyz/v1")
const provider = irysClient.api.rpcProvider
// or
const provider = new JsonRpcProvider("https://testnet-rpc.irys.xyz/v1/execution-rpc")
 
const balance = await provider.getBalance("<address>")


Programmable data quickstart
ℹ️
This guide assumes you're decently familiar with solidity smart contract development.
Create a programmable data smart contract
Programmable data is a feature leveraged through Solidity smart contracts via a custom precompile. We have a library contract to provide a cleaner API to use programmable data here
(opens in a new tab)
A full example Foundry project here
(opens in a new tab)
And an example E2E test using @irys/js here
(opens in a new tab)
To use this library, first create a Solidity contract that inherits ProgrammableData:
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// you will need to set up path remapping and clone the repository as a submodule,
// or copy the library files locally

import "@irys/precompile-libraries/libraries/ProgrammableData.sol";

contract ProgrammableDataBasic is ProgrammableData {
    bytes public storedData;

    function readPdBytesIntoStorage() public {
        (bool success, bytes memory data) = readBytes();
        require(success, "reading bytes failed");
        // write bytes to storage
        storedData = data;
    }

    function getStorage() public view returns (bytes memory) {
        return storedData;
    }
}


You then need to deploy your smart contract as normal.
To create a programmable data transaction (which will allow use of the ProgrammableData precompile), follow the following steps:
Create a set of Programmable Data read ranges
const accessList = await irysClient.programmable_data
    .read(transactionId, startOffset, length)
    .toAccessList();


This range will read bytes startOffset -> startOffset + length of transactionId's data.
ℹ️
Only transactions uploaded to the permanent ledger (ledgerId 0) can be read using programmable data. DataItems uploaded through Irys' bundlers are currently not supported (but will be!)
Add them to a execution Transaction
This should be a transaction aiming to call the readPdBytesIntoStorage method of the contract.
ℹ️
You will be charged for every chunk you request, even if you don't read them. So only attach a programmable data access list to a transaction that will use them!
    import { Wallet } from "ethers";
    const wallet = new Wallet(<key>, irysClient.api.rpcProvider)
    const evmTransaction = {
        accessList: [accessList],
        type: 2 // type must be EIP-1559 or higher
        ....
    }
    await wallet.sendTransaction(evmTransaction);
 


Once the transaction processes, you can call the getStorage contract method, which should return the data you specified in your programmable data read range. Note that you will pay normal rates for storing data in smart contract storage slots.


Quickstart
This covers how to make use of Irys's @irys/js package, but you can also use all EVM compatible tooling for developing apps on Irys.
Install
yarn install @irys/js


Grab some tokens!
The testnet faucet can be found here
(opens in a new tab)
Create the client
const irysClient = await new IrysClient("https://testnet-rpc.irys.xyz/v1")


Get your Irys address
ℹ️
Irys uses the same private keys as Ethereum
const { irys: irysAddress } = irysClient.account.getAddresses("private key") 


For more information about addresses, see Addresses
Check your balance
const balancemIrys = await irysClient.account.getBalance("address") // you can use either your Irys or execution address!


This gets your balance in mIrys (mini-irys), which you can think of as our version of wei
Create and post a data transaction
// Create a transaction
const tx = irysClient.createTransaction({...}) // the args are optional
 
// Generates merkle tree for the data
await tx.prepareChunks(<data>);
 
// Check the price (in mIrys) for uploading your transaction.
// Irys transactions have two fees, a term and a perm fee. 
// perm is only for if you want to store your data permanently (i.e ledger 0)
// Testnet currently only supports `perm` transactions.
 
const { termFee, permFee } = await tx.getFees();
 
// get the combined fee
const fee = await tx.getFee();
 
// Sign the transaction with your private key
const signedTx = await tx.sign(<key>);
 
// Upload the transaction header
await signedTx.uploadHeader();
 
// Upload the data
await signedTx.uploadChunks(<data>);




Connecting to the testnet
Network RPC
Node: testnet-rpc.irys.xyz
(opens in a new tab)
Wallet: wallet.irys.xyz
(opens in a new tab)
Explorer: testnet-explorer.irys.xyz
(opens in a new tab)
The chain is EVM compatible so you can use all standard EVM tooling including Metamask. The network also has custom endpoints for all datachain related activity.
Chain info
Ticker: IRYS Atomic unit: mIRYS (mini IRYS) Decimals: 18 Chain ID: 1270 EVM compatible JSON-RPC URL: https://testnet-rpc.irys.xyz/v1/execution-rpc
(opens in a new tab)
Connecting with Ethers
const irysClient = await new IrysClient("https://testnet-rpc.irys.xyz/v1")
const provider = irysClient.api.rpcProvider
// or
const provider = new JsonRpcProvider("https://testnet-rpc.irys.xyz/v1/execution-rpc")
 
const balance = await provider.getBalance("<address>")


Programmable data quickstart
ℹ️
This guide assumes you're decently familiar with solidity smart contract development.
Create a programmable data smart contract
Programmable data is a feature leveraged through Solidity smart contracts via a custom precompile. We have a library contract to provide a cleaner API to use programmable data here
(opens in a new tab)
A full example Foundry project here
(opens in a new tab)
And an example E2E test using @irys/js here
(opens in a new tab)
To use this library, first create a Solidity contract that inherits ProgrammableData:
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// you will need to set up path remapping and clone the repository as a submodule,
// or copy the library files locally

import "@irys/precompile-libraries/libraries/ProgrammableData.sol";

contract ProgrammableDataBasic is ProgrammableData {
    bytes public storedData;

    function readPdBytesIntoStorage() public {
        (bool success, bytes memory data) = readBytes();
        require(success, "reading bytes failed");
        // write bytes to storage
        storedData = data;
    }

    function getStorage() public view returns (bytes memory) {
        return storedData;
    }
}


You then need to deploy your smart contract as normal.
To create a programmable data transaction (which will allow use of the ProgrammableData precompile), follow the following steps:
Create a set of Programmable Data read ranges
const accessList = await irysClient.programmable_data
    .read(transactionId, startOffset, length)
    .toAccessList();


This range will read bytes startOffset -> startOffset + length of transactionId's data.
ℹ️
Only transactions uploaded to the permanent ledger (ledgerId 0) can be read using programmable data. DataItems uploaded through Irys' bundlers are currently not supported (but will be!)
Add them to a execution Transaction
This should be a transaction aiming to call the readPdBytesIntoStorage method of the contract.
ℹ️
You will be charged for every chunk you request, even if you don't read them. So only attach a programmable data access list to a transaction that will use them!
    import { Wallet } from "ethers";
    const wallet = new Wallet(<key>, irysClient.api.rpcProvider)
    const evmTransaction = {
        accessList: [accessList],
        type: 2 // type must be EIP-1559 or higher
        ....
    }
    await wallet.sendTransaction(evmTransaction);
 


Once the transaction processes, you can call the getStorage contract method, which should return the data you specified in your programmable data read range. Note that you will pay normal rates for storing data in smart contract storage slots.


Addresses
Irys uses two address formats, one base58 encoded (i.e 2QZrWyPPi4XukwiJQrVmUvuPQ57F) known as the Irys address, and one hex encoded (i.e 0x64f1a2829e0e698c18e7792d6e74f67d89aa0a32), the Execution address - which is a traditional EVM address. Both address types are cross-convertable, with the execution address being a hex encoding of the decoded Irys address bytes. @irys/js has some conversion utilities you can use:
import {irysToExecAddr, execToIrysAddr } from "@irys/js/common/utils"
 
const irysAddress = "2QZrWyPPi4XukwiJQrVmUvuPQ57F";
const execAddress = "0x64f1a2829e0e698c18e7792d6e74f67d89aa0a32"
irysToExecAddr(irysAddress) //  "0x64f1a2829e0e698c18e7792d6e74f67d89aa0a32"
execToIrysAddr(execAddress) //  "2QZrWyPPi4XukwiJQrVmUvuPQ57F"

Irys & execution addresses are derived using the same private key, so your Irys execution address will be identical to your usual EVM one.
Last updated on January 29, 2025





above is all the information i have about building on irys. Request if u have any enquiries or concerns, or information required
//readmeinformationonirys.md