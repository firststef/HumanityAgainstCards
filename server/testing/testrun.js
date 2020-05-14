/** UNIT TESTING

1. Create a function in tests.js,

the function should be like this:
=async function NAME (unitTester, test){ ... }

inside the function you might have something like this:
=try{
    assert(1==1,'Failed basic egality');
    assert(YOUR CONDITION TO BE TRUE HERE, MESSAGE IF FAILS HERE);
}
catch (e) { //IF FAILED, CATCH ASSERT THROW AND RETURN
    unitTester.notify(test, {status: 'failed', message: e.message});
    return;
}
//IF NOT FAILED, THIS PART IS REACHED, NOTIFY SUCCESS
 unitTester.notify(test, {status: 'success'});

this function, when the tests are passed should call this when it reaches the end:
=unitTester.notify(test, {status: 'success'});

if the tests fail, catch it and make sure you are exiting the function
=unitTester.notify(test, {status: 'failed', message: e.message});

if there is some sort of fatal error, for instance the server is not on, use FATAL:
=unitTester.notify(test, {status: 'fatal', message: err});

2. Register your function in testrun.js
Example:
=unitTester.register('AI get card', tests.testAIGetCard);
=unitTester.register(NAME, YOUR FUNCTION);

3. The tester should have at the end:
=unitTester.run();

4. To run the tester call npm test

 */

const unitTester = new (require('./unittester').UnitTester)();
const tests = require('./tests');
const server = require('child_process').fork('index');

unitTester.register('AI get card', tests.testAIGetCard);

unitTester.run();