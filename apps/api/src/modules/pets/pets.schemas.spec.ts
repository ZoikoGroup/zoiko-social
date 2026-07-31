import { CreatePetSchema, UpdatePetSchema } from './pets.schemas'

describe('CreatePetSchema — About fields', () => {
  const base = { name: 'Luna', species: 'Cat' }

  it('accepts a pet with every About field set', () => {
    const parsed = CreatePetSchema.parse({
      ...base,
      birthdate: '2021-03-04',
      color: 'Tabby with white chest',
      microchipId: '900215000123456',
      neutered: true,
      adoptionDate: '2021-06-01',
      bio: 'Loves the window sill.',
    })
    expect(parsed.color).toBe('Tabby with white chest')
    expect(parsed.microchipId).toBe('900215000123456')
    expect(parsed.neutered).toBe(true)
    expect(parsed.adoptionDate).toBe('2021-06-01')
  })

  it('accepts a pet with no About fields at all', () => {
    expect(() => CreatePetSchema.parse(base)).not.toThrow()
  })

  it('trims whitespace on free-text fields', () => {
    const parsed = CreatePetSchema.parse({ ...base, color: '  Ginger  ', microchipId: ' 123 ' })
    expect(parsed.color).toBe('Ginger')
    expect(parsed.microchipId).toBe('123')
  })

  it('rejects a malformed date', () => {
    expect(() => CreatePetSchema.parse({ ...base, birthdate: '04/03/2021' })).toThrow()
    expect(() => CreatePetSchema.parse({ ...base, adoptionDate: 'yesterday' })).toThrow()
  })

  it('rejects an empty date on create — there is nothing to clear yet', () => {
    expect(() => CreatePetSchema.parse({ ...base, birthdate: '' })).toThrow()
  })

  it('rejects over-long free text', () => {
    expect(() => CreatePetSchema.parse({ ...base, color: 'x'.repeat(61) })).toThrow()
    expect(() => CreatePetSchema.parse({ ...base, microchipId: 'x'.repeat(61) })).toThrow()
  })

  it('rejects a non-boolean neutered value', () => {
    expect(() => CreatePetSchema.parse({ ...base, neutered: 'yes' })).toThrow()
  })
})

describe('UpdatePetSchema — clearing fields', () => {
  // The UI sends '' / null to mean "unset this". Without these, a cleared field
  // would fail validation or be silently dropped from the JSON payload.
  it('accepts an empty string for dates as an explicit clear', () => {
    expect(UpdatePetSchema.parse({ birthdate: '' }).birthdate).toBe('')
    expect(UpdatePetSchema.parse({ adoptionDate: '' }).adoptionDate).toBe('')
  })

  it('accepts null for neutered as an explicit reset to not-specified', () => {
    expect(UpdatePetSchema.parse({ neutered: null }).neutered).toBeNull()
  })

  it('still accepts real values', () => {
    expect(UpdatePetSchema.parse({ birthdate: '2020-01-01' }).birthdate).toBe('2020-01-01')
    expect(UpdatePetSchema.parse({ neutered: false }).neutered).toBe(false)
  })

  it('still rejects a malformed date', () => {
    expect(() => UpdatePetSchema.parse({ birthdate: '2020-1-1' })).toThrow()
  })

  it('allows a partial payload — omitted keys mean leave unchanged', () => {
    expect(UpdatePetSchema.parse({ color: 'Black' })).toEqual({ color: 'Black' })
  })
})
