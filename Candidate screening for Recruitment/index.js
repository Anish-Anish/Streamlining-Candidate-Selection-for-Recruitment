const mongoose = require('mongoose');
const express = require('express');
const UserModel = require('./models/user');
const Signup = require('./models/signup');
const bcrypt = require('bcrypt');
const path = require('path');



const app = express();
let isSigned = false;

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


// const atlasConnectionURI = 'mongodb+srv://darksun:<VwX54lyTW5V3QpQQ>@cluster0.xz6f2yj.mongodb.net/employee_details';
// mongoose.connect(atlasConnectionURI, {
//     authSource: 'admin', 
//     user: 'darksun', 
//     pass: 'VwX54lyTW5V3QpQQ', 
//   }) .then(() => {
//         console.log("Connected to MongoDB Atlas");
    
//         app.listen(3000, () => {
//           console.log("App listening at port 3000");
//         });
//       });


const localConnectionURI = "mongodb://localhost:27017/employee_details";

mongoose
  .connect(localConnectionURI)
  .then(() => {
    console.log("Connected to local MongoDB server");
    app.listen(3000, () => {
      console.log("App listening at port 3000");
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });




  const authenticate = (req, res, next) => {
  if (isSigned) {
    next();
  } else {
    res.redirect('/');
  }
};

app.get('/index', authenticate, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/admin', authenticate, (req, res) => {
  console.log(isSigned);
  res.sendFile(path.join(__dirname, 'views/template', 'index.html'));
});

app.post('/api/user', authenticate, (req, res) => {
  const saveUser = new UserModel(req.body);

  saveUser.save()
    .then((savedUser) => {
      res.json(savedUser);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});



app.post('/sign-up', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newSign = new Signup({
      username: username,
      email: email,
      password: hashedPassword,
    });

    const savedUser = await newSign.save();

   
    res.render('success', {
      message: 'Your credentials have been added to our Base. Please proceed to login.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get('/api/users', authenticate, (req, res) => {
  UserModel.find()
    .then((users) => {
      console.log(users); 
      res.render('usercard', { users: users });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});



app.get('/user/:id', authenticate, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Remove this line to prevent user deletion
    // await UserModel.findByIdAndDelete(userId);

    res.render('viewmore', { user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});




app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'auth', 'login.html'));
});

app.get('/login-res', async (req, res) => {
  const { username, password } = req.query;

  try {
    if (username === 'admin@example.com' && password === 'admin') {
      isSigned = true;
      return res.sendFile(path.join(__dirname, 'views/template', 'index.html'));
    }

    const user = await Signup.findOne({ email: username });

    if (user) {
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (isPasswordMatch) {
        isSigned = true;
        return res.sendFile(path.join(__dirname, 'views', 'index.html'));
      } else {
        return res.status(401).send('Invalid credentials');
      }
    } else {
      return res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

app.get('/logout', (req, res) => {
  isSigned = false;
  res.redirect('/');
});


