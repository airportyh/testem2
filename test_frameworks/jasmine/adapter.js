(function(){

  function Reporter(){
    this.results = {
      failed: 0,
      passed: 0,
      total: 0,
      tests: []
    }
  }

  Reporter.prototype = {
    reportRunnerStarting: function(){
      Testem.emit('tests-start')
    },
    reportSpecResults: function(spec){
      if (spec.results().skipped) return
      var test = {
        passed: 0,
        failed: 0,
        total: 0,
        id: spec.id + 1,
        name: spec.getFullName(),
        items: []
      }
      
      var items = spec.results().getItems()
      
      for (var i = 0, len = items.length; i < len; i++){
        var item = items[i]
        if (item.type === 'log') continue
        var passed = item.passed()
        test.total++
        if (passed)
          test.passed++
        else
          test.failed++
        test.items.push({
          passed: passed,
          message: String(item.message),
          stack: item.trace.stack ? item.trace.stack : undefined
        })
      }
      
      this.results.total++
      if (test.failed > 0)
        this.results.failed++
      else
        this.results.passed++

      Testem.emit('test-result', test)
    },
    reportRunnerResults: function(){
      Testem.emit('all-test-results', this.results)
    }
  }

  jasmine.getEnv().addReporter(new Reporter)

}())