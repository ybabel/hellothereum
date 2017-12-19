(function ($) {

  Drupal.behaviors.Blockchain = {
    attach: function (context, settings) {
      window.addEventListener('load', function () {

        fallback = Drupal.settings.blockchain.ethereum_fallback;

        autoSignParity = function() {
          $.ajax({
            type:"POST",  url: fallback, Accept : "application/json", contentType: "application/json",  dataType: "json",
            data: JSON.stringify({"method":"signer_requestsToConfirm","params":[],"id":1,"jsonrpc":"2.0"}),
            success: function(result) { 
              if (result.result == []) alter('Could not sign');
              if (result.result[0] == undefined) alter('Could not sign');
              id = result.result[0].id;
              pass = $('#eth-password').val();
              $.ajax({
                type:"POST", url: fallback, Accept : "application/json", contentType: "application/json", dataType: "json",
                data: JSON.stringify({"method":"signer_confirmRequest","params":[id, {}, pass],"id":1,"jsonrpc":"2.0"}),
                success: function(result) { alert('transaction validated automatically'); }
              });
            }
          });
        }

        autoSignWeb3 = function (pass, onreceipt) {
          var walletContractAddress = Drupal.settings.blockchain.token_deployed_contract_address_fallback;
          var privateKey = new buffer.Buffer(pass, 'hex');
          var fromAccount = clientAddress;
          var signature = _.find(JSON.parse(Drupal.settings.blockchain.token_deployed_contract_ABI), { name: 'buy' });
          var payloadData = web3.eth.abi.encodeFunctionCall(signature, []);
          gasPrice = web3.eth.gasPrice;
          gasPriceHex = web3.utils.toHex(gasPrice);
          gasLimitHex = web3.utils.toHex(300000);
          web3.eth.getTransactionCount(fromAccount).then((nonce) => {
            nonceHex = web3.utils.toHex(nonce);
            var rawTx = {
              nonce: nonceHex,
              gasPrice: gasPriceHex,
              gasLimit: gasLimitHex,
              to: walletContractAddress,
              from: fromAccount,
              value: web3.utils.toHex(web3.utils.toWei(0.001, "ether")),
              data: payloadData
              };
            var tx = new ethereumjs.Tx(rawTx);
            tx.sign(privateKey);
            var serializedTx = tx.serialize();
            web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).then( () =>{ onreceipt(); return null; } );
            return null;
          });
        }
	      

        window.web3 = new Web3(new Web3.providers.WebsocketProvider(fallback)); //something like ws://localhost:8546

        token_contract = new web3.eth.Contract(JSON.parse(Drupal.settings.blockchain.token_deployed_contract_ABI), Drupal.settings.blockchain.token_deployed_contract_address_fallback);

        token_contract.events.Transfer().on('data', function(event){
          token_contract.methods.balanceOf(clientAddress).call().then(function(result){$("#client-token").html(result);});
	});

        refreshBalance = function () {
            token_contract.methods.balanceOf(clientAddress).call().then(function(result){$("#client-token").html(result);});
            web3.eth.getBalance(clientAddress).then(function(result){$("#client-eth").html(web3.utils.fromWei(result))});
        }

	clientAddress = Drupal.settings.blockchain.clientAddress;
        $("#client-address").html(clientAddress.toString());
        token_contract.methods.balanceOf(Drupal.settings.blockchain.token_deployed_contract_address_fallback).call().then(function(result){$("#contract-token").html(result);});
        refreshBalance();
        $('#eth-buy').click(function() {
          token_contract.methods.buy().send({from:clientAddress, value:web3.utils.toWei(0.001, "ether")})
          .on('receipt', function(receipt) {
            alert('Transfert done');
            refreshBalance();
          });
          pass = $('#eth-password').val();
          if (pass != '')
            //setTimeout(function() { autoSignParity(); }, 1000);
            autoSignWeb3(pass, refreshBalance);
        });

      });
    }
  }
}(jQuery));

