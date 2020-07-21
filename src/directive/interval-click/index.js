export default {
  bind(el, binding) {
    const { func, time, arg } = binding.value
    el.addEventListener('click', () => {
      if (!el.disabled) {
        el.disabled = true
        setTimeout(() => {
          el.disabled = false
        }, time || 1000)
        func(arg)
      }
    }, false)
  }
}
