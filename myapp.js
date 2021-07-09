const Koa = require("koa");
const router = require("koa-router")();
const app = new Koa();
const json = require('koa-json')
const bodyParser = require('koa-bodyparser');
const fs = require('fs');
const koaBody = require('koa-body');

app.use(koaBody());
app.use(json())
app.use(router.routes()).use(router.allowedMethods())
app.use(bodyParser())

router.get("/data", async (ctx, next) => {
  try{
    let data = JSON.parse(fs.readFileSync('./data.json', 'utf8'))
    ctx.body = data
  }
  catch(e){
    ctx.body = e.message
  }
});

router.post("/getData", async (ctx, next) => {
  try{
    let data = JSON.parse(fs.readFileSync('./data.json', 'utf8'))
    let newData = ctx.request.body
    newData.id = data.length+1
    data.push(newData)
    fs.writeFileSync('./data.json', JSON.stringify(data))
    ctx.body = "Data added successfully"
  }
  catch(e){
    ctx.body = e.message
  }
});

router.delete("/deleteUser/:id",  async(ctx, next) => {
  try{
    const userId = parseInt(ctx.params.id)
    let data = JSON.parse(fs.readFileSync('./data.json', 'utf8'))
    let exists = data.find(item => item.id === userId)
    if(exists){
      data = data.filter(item => item.id !== userId)
      fs.writeFileSync('./data.json', JSON.stringify(data))
      ctx.body = "Data deleted successfully"
    }
    else{
      ctx.body = "Data not found"
    }
  }
  catch(e){
    ctx.body = e.message
  }
})

router.put("/updateData/:id", async(ctx, next) => {
  try{
    const userId = parseInt(ctx.params.id)
    let data = JSON.parse(fs.readFileSync('./data.json', 'utf8'))
    let exists = data.find(item => item.id === userId)
    const values = ctx.request.body
    const keys = Object.keys(values)
    if(exists){
      keys.forEach(key => {
        exists[key] = values[key]
      })
      data[data.indexOf(exists)] = exists
      fs.writeFileSync('./data.json', JSON.stringify(data))
      ctx.body = "Data updated successfully"
    }
    else{
      ctx.body = "Data not found"
    }
  }
  catch(e){
    ctx.body = e.message
  }
})


app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000, () => {
    console.log('server running at 3000')
});