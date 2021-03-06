const execa = require('execa')
const jetpack = require('fs-jetpack')
const tempy = require('tempy')

const IGNITE = 'npx ignite-cli'
const APP = 'IntegrationTest'
const BOILERPLATE = jetpack.path(__dirname, '..')

// calling the ignite cli takes a while
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000

const exopts = {
  preferLocal: false,
  shell: true
}

describe('generators', () => {
  beforeAll(async () => {
    // creates a new temp directory
    process.chdir(tempy.directory())
    await execa(IGNITE, ['new', APP, '--min', '--skip-git', '--boilerplate', BOILERPLATE], exopts)
    process.chdir(APP)
    await execa('npm', ['run', 'fixcode'], exopts)
  })

  test('generates a component', async () => {
    const simpleComponent = 'Simple'
    await execa(IGNITE, ['g', 'component', simpleComponent], exopts)
    expect(jetpack.exists(`App/Components/${simpleComponent}.js`)).toBe('file')
    expect(jetpack.exists(`App/Components/Styles/${simpleComponent}Style.js`)).toBe('file')
    const lint = await execa('npm', ['-s', 'run', 'lint', '--loglevel=error'], exopts)
    expect(lint.stderr).toBe('')
  })

  test('generates a folder component', async () => {
    const folderComponent = 'Folder'
    await execa(IGNITE, ['g', 'component', '--folder', folderComponent], exopts)
    expect(jetpack.exists(`App/Components/${folderComponent}/index.js`)).toBe('file')
    expect(jetpack.exists(`App/Components/${folderComponent}/Styles/indexStyle.js`)).toBe('file')
    const lint = await execa('npm', ['-s', 'run', 'lint', '--loglevel=error'], exopts)
    expect(lint.stderr).toBe('')
  })

  test('generates a component inside a folder', async () => {
    const componentName = 'InFolder'
    const folderName = 'Folder'
    await execa(IGNITE, ['g', 'component', '--folder', folderName, componentName], exopts)
    expect(jetpack.exists(`App/Components/${folderName}/${componentName}.js`)).toBe('file')
    expect(jetpack.exists(`App/Components/${folderName}/Styles/${componentName}Style.js`)).toBe('file')
    const lint = await execa('npm', ['-s', 'run', 'lint', '--loglevel=error'], exopts)
    expect(lint.stderr).toBe('')
  })

  test('generates a component in a relative path', async () => {
    await execa(IGNITE, ['g', 'component', 'My/SubFolder/Test'], exopts)
    expect(jetpack.exists('App/Components/My/SubFolder/Test.js')).toBe('file')
    expect(jetpack.exists('App/Components/My/SubFolder/Styles/TestStyle.js')).toBe('file')
    const lint = await execa('npm', ['-s', 'run', 'lint', '--loglevel=error'], exopts)
    expect(lint.stderr).toBe('')
  })

  test('generate listview of type row works', async () => {
    await execa(IGNITE, ['g', 'list', 'TestRow', '--type=Row', '--codeType=listview', '--dataType=Single'], exopts)
    expect(jetpack.exists('App/Containers/TestRow.js')).toBe('file')
    expect(jetpack.exists('App/Containers/Styles/TestRowStyle.js')).toBe('file')
    const lint = await execa('npm', ['run', 'lint', '--loglevel=error'], exopts)
    expect(lint.stderr).toBe('')
  })

  test('generate flatlist of type row works', async () => {
    await execa(IGNITE, ['g', 'list', 'TestFlatRow', '--type=Row', '--codeType=flatlist', '--dataType=Single'], exopts)
    expect(jetpack.exists('App/Containers/TestFlatRow.js')).toBe('file')
    expect(jetpack.exists('App/Containers/Styles/TestFlatRowStyle.js')).toBe('file')
    const lint = await execa('npm', ['run', 'lint', '--loglevel=error'], exopts)
    expect(lint.stderr).toBe('')
  })

  test('generate listview of sections works', async () => {
    await execa(
      IGNITE,
      ['g', 'list', 'TestSection', '--type=Row', '--codeType=listview', '--dataType=Sectioned'],
      exopts
    )
    expect(jetpack.exists('App/Containers/TestSection.js')).toBe('file')
    expect(jetpack.exists('App/Containers/Styles/TestSectionStyle.js')).toBe('file')
    const lint = await execa('npm', ['run', 'lint', '--loglevel=error'], exopts)
    expect(lint.stderr).toBe('')
  })

  test('generate flatlist of sections works', async () => {
    await execa(
      IGNITE,
      ['g', 'list', 'TestFlatSection', '--type=Row', '--codeType=flatlist', '--dataType=Sectioned'],
      exopts
    )
    expect(jetpack.exists('App/Containers/TestFlatSection.js')).toBe('file')
    expect(jetpack.exists('App/Containers/Styles/TestFlatSectionStyle.js')).toBe('file')
    const lint = await execa('npm', ['run', 'lint', '--loglevel=error'], exopts)
    expect(lint.stderr).toBe('')
  })

  test('generate listview of type grid works', async () => {
    await execa(IGNITE, ['g', 'list', 'TestGrid', '--type=Grid', '--codeType=listview', '--dataType=Single'], exopts)
    expect(jetpack.exists('App/Containers/TestGrid.js')).toBe('file')
    expect(jetpack.exists('App/Containers/Styles/TestGridStyle.js')).toBe('file')
    const lint = await execa('npm', ['run', 'lint', '--loglevel=error'], exopts)
    expect(lint.stderr).toBe('')
  })

  test('generate redux works', async () => {
    await execa(IGNITE, ['g', 'redux', 'Test'], exopts)
    expect(jetpack.exists('App/Redux/TestRedux.js')).toBe('file')
    const lint = await execa('npm', ['run', 'lint', '--loglevel=error'], exopts)
    expect(lint.stderr).toBe('')
  })

  test('generate container works', async () => {
    await execa(IGNITE, ['g', 'container', 'Container'], exopts)
    expect(jetpack.exists('App/Containers/Container.js')).toBe('file')
    expect(jetpack.exists('App/Containers/Styles/ContainerStyle.js')).toBe('file')
    const lint = await execa('npm', ['run', 'lint', '--loglevel=error'], exopts)
    expect(lint.stderr).toBe('')
  })

  test('generate saga works', async () => {
    await execa(IGNITE, ['g', 'saga', 'Test'], exopts)
    expect(jetpack.exists('App/Sagas/TestSagas.js')).toBe('file')
    const lint = await execa('npm', ['run', 'lint', '--loglevel=error'], exopts)
    expect(lint.stderr).toBe('')
  })

  test('generate screen works', async () => {
    await execa(IGNITE, ['g', 'screen', 'Test'], exopts)
    expect(jetpack.exists('App/Containers/TestScreen.js')).toBe('file')
    expect(jetpack.exists('App/Containers/Styles/TestScreenStyle.js')).toBe('file')
    const lint = await execa('npm', ['run', 'lint', '--loglevel=error'], exopts)
    expect(lint.stderr).toBe('')
  })
})
