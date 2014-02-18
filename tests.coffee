
describe 'hello', ->

  it 'should say hello', ->
    expect(hello()).to.equal 'Hello, world!'

  it 'should say hello to subject', ->
    expect(hello('Bob')).to.equal 'Hello, Bob!'