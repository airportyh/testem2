
suite 'hello', ->

  test 'should say hello', ->
    assert.equal hello(), 'Hello, world!'

  test 'should say hello to subject', ->
    assert.equal hello('Bob'), 'Hello, Bob!'