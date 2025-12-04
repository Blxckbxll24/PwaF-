import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('renders F1 landing page properly', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('La Máxima')
    expect(wrapper.text()).toContain('Velocidad')
    expect(wrapper.text()).toContain('del Automovilismo')
  })
})
