# Wallet System
The app is a wallet system for a product that can be used in multiple countries

### There are three types of user:

1. NOOB
- Can only have a wallet in a single currency selected at signup (main).
- All wallet funding in a different currency are converted to the main currency.
- All wallet withdrawals in a different currency are converted to the main currency before transactions are approved.
- All wallet funding has to be approved by an administrator.
- Cannot change main currency.

2. ELITE
- Can have multiple wallets in different currencies with a main currency selected at signup.
- Funding in a particular currency will update the wallet with that currency or create it.
- Withdrawals in a currency with funds in the wallet of that currency will reduce the wallet balance for that currency.
- Withdrawals in a currency without a wallet balance will be converted to the main currency and withdrawn.
- Cannot change main currency

3. ADMIN
- Cannot have a wallet.
- Cannot withdraw funds from any wallet.
- Can fund wallets for Noob or Elite users in any currency.
- Can change the main currency of any user.
- Approves wallet funding for Noob users.
- Can promote or demote Noobs or Elite users

### App link:
https://sleepy-sierra-67571.herokuapp.com/

### API documentation:
https://web.postman.co/documentation/12793868-7ba4516f-08ce-47d3-b702-31df37cc2832/publish

### Admin login
The email address of the admin is appadministrator@admin.com