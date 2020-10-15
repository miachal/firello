### firello

demo: [click to see](https://firello.herokuapp.com)

###### before use you should create src/firebase.ts with below content

```
import firebase from 'firebase';
import 'firebase/database';

export default firebase
  .initializeApp({
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  })
  .database();
```
