import {
  getVarsInPath,
  isJsonString,
  routeResolve,
  getSortedRoutesSlug
} from '../../src/utils'

describe('getVarsInPath', () => {
  it('find no vars in path', () => {
    const path = '/posts'
    const expectedFoundVars = []

    expect(getVarsInPath(path)).toStrictEqual(expectedFoundVars)
  })

  it('find 1 vars in path', () => {
    const path = '/users/[userid]'
    const expectedFoundVars = ['userid']

    expect(getVarsInPath(path)).toStrictEqual(expectedFoundVars)
  })

  it('find 2 vars in path', () => {
    const path = '/posts/[postid]/comments/[commentid]'
    const expectedFoundVars = ['postid', 'commentid']

    expect(getVarsInPath(path)).toStrictEqual(expectedFoundVars)
  })

  it('find 2 vars in path with json extension', () => {
    const path = '/posts/[postid]/comments/[commentid].json'
    const expectedFoundVars = ['postid', 'commentid']

    expect(getVarsInPath(path)).toStrictEqual(expectedFoundVars)
  })
})

describe('routeResolve', () => {
  it('should concat 2 routes that have conflict in slash', () => {
    const expectedRoute = '/users/comments/tests'

    expect(routeResolve('/users/comments/', '/tests')).toBe(expectedRoute)
  })

  it('should concat 2 routes that have no slash', () => {
    const expectedRoute = '/users/comments/tests'

    expect(routeResolve('/users/comments', 'tests')).toBe(expectedRoute)
  })

  it('should concat 2 routes that have 1 slash', () => {
    const expectedRoute = '/users/comments/tests'

    expect(routeResolve('/users/comments/', 'tests')).toBe(expectedRoute)
  })

  describe('isJsonString', () => {
    expect(isJsonString('{"test": "its json"}')).toBeTruthy()
    expect(isJsonString('{"test": "its json"')).toBe('Unexpected end of JSON input')
    expect(isJsonString('test')).toBe('Unexpected token e in JSON at position 1')
  })
})

describe('getSortedRoutesSlug', () => {
  it('Slugs with variables should be after specific slug', () => {
    const slugs = [
      '/animals/[name]',
      '/animals/hedgehog',
      '/animals/[name]/friends',
      '/animals/[name]/friends/[friend_id]',
      '/animals/[name]/friends/42',
      '/animals/[name]/friends/mario'
    ]
    const expectedResult = [
      '/animals/[name]/friends/mario',
      '/animals/[name]/friends/42',
      '/animals/[name]/friends/[friend_id]',
      '/animals/[name]/friends',
      '/animals/hedgehog',
      '/animals/[name]',
    ]

    expect(getSortedRoutesSlug(slugs)).toStrictEqual(expectedResult)
  })
})