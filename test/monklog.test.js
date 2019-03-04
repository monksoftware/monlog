const { describe, it } = require('mocha')
const chai = require('chai')

const rawLoglevelLogger = require('loglevel')
const log = require('../index')

const expect = chai.expect

describe('monk log', () => {
  it('should export an instance of MonkLogger', () => {
    expect(log.constructor.name).to.equal('MonkLogger')
  })
  it("should export loggers that are instances of loglevel's loggers", () => {
    expect(log).to.be.instanceOf(rawLoglevelLogger.constructor)
  })
  it('should be possible to log directly from root logger', () => {
    expect(log.info('Ciao!')).to.not.throw
  })
  it('should default to WARN level', () => {
    expect(log.getLevel()).to.equal(log.levels.WARN)
  })
  it('should require a name when requesting a sublogger', () => {
    expect(() => log.getLogger()).to.throw('must supply a name')
  })
  it('should return a sublogger with the same options as the parent one if no options supplied', () => {
    const subLogger = log.getLogger('sub')
    expect(subLogger.options).to.deep.equal(log.options)
    expect(subLogger.getLevel()).to.equal(log.getLevel())
  })
  it('should return a sublogger with the supplied level, but not touch the original logger level', () => {
    // Use different name than previous tests because loglevels caches loggers
    const subLogger = log.getLogger('sub2', log.levels.ERROR)
    expect(subLogger.getLevel()).to.equal(log.levels.ERROR)
    expect(log.getLevel()).to.equal(log.levels.WARN)
  })
  it('should apply sublogger specific options, and inherit other ones from parent', () => {
    // Use different name than previous tests because loglevels caches loggers
    const subLogger = log.getLogger('sub3', null, {template: 'new template'})
    expect(subLogger.options.levelFormatter).to.equal(log.options.levelFormatter)
    expect(subLogger.options.timestampFormatter).to.equal(log.options.timestampFormatter)
    expect(subLogger.options.nameFormatter).to.equal(log.options.nameFormatter)
    expect(subLogger.options.format).to.equal(log.options.format)
    expect(subLogger.options.template).to.not.equal(log.options.template)
    expect(subLogger.options.template).to.equal('new template')
  })
})
