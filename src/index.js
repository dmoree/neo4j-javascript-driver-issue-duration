const neo4j = require('neo4j-driver')

const NEO4J_URL = 'neo4j://localhost:7687/neo4j'
const NEO4J_USER = 'neo4j'
const NEO4J_PASSWORD = 'password'

const connect = async () => {
  const driver = neo4j.driver(
    NEO4J_URL,
    neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD)
  )
  try {
    await driver.verifyConnectivity()
    return driver
  } catch (error) {
    console.error(`Error connecting to neo4j at ${NEO4J_URL}: ${error.message}`)
    process.exit(1)
  }
}

const main = async () => {
  const driver = await connect()
  const session = driver.session()
  try {
    const months = 6.5
    const days = 0
    const seconds = 0
    const nanoseconds = 0

    const duration = new neo4j.types.Duration(
      months,
      days,
      seconds,
      nanoseconds
    )
    console.log(`Creating node with duration: ${JSON.stringify(duration, null, 2)}`)
    const { records: [record] } = await session.run(
      `
        CREATE (node:DurationIssue)
        SET node.duration = $duration
        RETURN node.duration as duration
      `,
      {
        duration,
      }
    )
    console.log(`Created node with duration: ${record.toObject().duration.toString()}`)
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`)
  } finally {
    await session.close()
    await driver.close()
    process.exit()
  }
}

main()
