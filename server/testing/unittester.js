class UnitTester{
    constructor() {
        this.tests = [];
    }

    register(testName, callback){
        this.tests.push({name: testName, callback: callback});
    }

    run(){
        for (let test of this.tests){
            test.callback(this, test);
        }
    }

    notify(test, result){
        if (result.status === 'success' && test.passed === undefined){
            console.log('[  OK  ] ', test.name);
            test.passed = true;
        }
        else if (result.status === 'failed'){
            console.log('[ERROR!] ', test.name + ' \n' + result.message);
            test.passed = false;
        }
        else if (result.status === 'fatal') {
            console.log('[FATAL!] ', test.name + ' \n' + result.message);
            test.passed = false;
        }
        else {
            console.log('[UNKNWN] Unknown error occured on test ' + test.name);
        }

        let numOfTests = this.tests.length;
        let finishedTests = 0;
        for (let test of this.tests){
            if (test.passed !== undefined){
                finishedTests++;
            }
        }
        if (finishedTests === numOfTests){
            this.stats();
        }
    }

    stats(){
        let numOfTests = this.tests.length;
        let passedTests = 0;
        for (let test of this.tests){
            if (test.passed){
                passedTests++;
            }
        }
        console.log(passedTests + '/' + numOfTests);
        if (numOfTests > 0){
            console.log('Percentage%: ' + passedTests / numOfTests);
        }
    }
}

module.exports.UnitTester = UnitTester;