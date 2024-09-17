const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Use EJS as the template engine
app.set('view engine', 'ejs');

// Serve static files from the 'public' folder
app.use('/static', express.static(path.join(__dirname, 'public')));

// Use bodyParser middleware to handle form submissions
app.use(bodyParser.urlencoded({ extended: false }));

// Store posts and categories in objects for easy manipulation
const dataStore = {
  posts: [
    {
      id: 0,
      title: "Learning a new Lifestyle",
      author: "Sarah",
      timestamp: "09/5/2024 10:00 AM",
      content: "I want to better myself by working on my mental and physical health.",
      category: "Lifestyle"
    },
    {
      id: 1,
      title: "Space Exploration",
      author: "John",
      timestamp: "09/9/2024 4:20 PM",
      content: "I'm interested as to what lies in our universe",
      category: "Space Science"
    },
    {
      id: 2,
      title: "Productive at all times",
      author: "David",
      timestamp: "09/12/2024 8:30 AM",
      content: "How I learned to be productive at all times",
      category: "Misc"
    }
  ],
  categories: ["Lifestyle", "Space Science", "Misc"]
};

// Helper function to generate the current timestamp
const generateTimestamp = () => {
  const now = new Date();
  return now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Route to display the homepage with posts and categories
app.get('/', (req, res) => {
  const { posts, categories } = dataStore;
  res.render('index', { pageTitle: 'Blog Overview', posts, categories });
});

// Route to handle new post creation
app.post('/new-post', (req, res) => {
  const { title, author, content, category } = req.body;

  // Add new category if it doesn't exist
  if (!dataStore.categories.includes(category)) {
    dataStore.categories.push(category);
  }

  // Create new post and push to posts array
  const newPost = {
    id: dataStore.posts.length,
    title,
    author,
    content,
    category,
    timestamp: generateTimestamp()
  };
  dataStore.posts.push(newPost);

  res.redirect('/');
});

// Route to handle editing an existing post
app.post('/modify-post/:id', (req, res) => {
  const { id } = req.params;
  const { title, content, author } = req.body;

  // Update post by finding it using the ID
  const post = dataStore.posts.find(p => p.id == id);
  if (post) {
    post.title = title;
    post.content = content;
    post.author = author;
    post.timestamp = generateTimestamp();
  }

  res.redirect('/');
});

// Route to handle deleting a post
app.get('/remove-post/:id', (req, res) => {
  const { id } = req.params;

  // Filter the post array to remove the post with the matching ID
  dataStore.posts = dataStore.posts.filter(post => post.id != id);

  res.redirect('/');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is live at http://localhost:${PORT}`);
});
