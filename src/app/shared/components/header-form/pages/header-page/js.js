import { environment } from 'src/environments/environment';

async function getCells(){
    let response = await fetch(`${environment.url}'cells'`)
    response = await response.json()
    
    console.log(response)
    
    
  }

  getCells()