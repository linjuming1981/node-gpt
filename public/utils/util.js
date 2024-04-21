export const fixTpl = async (Comp, dir) => {
  const code = await axios({
    url: `${dir}/template.html`,
  })
  console.log(111, code)
  return code
}