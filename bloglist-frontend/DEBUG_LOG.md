# Part 5

<hr>
<hr>

# 1 - Invalid Context Error in React Component

- **Context**: `props` used for accessing `children` components through a Parent component for setting up Toggle visibility is invalid and throws error - `TypeError: Cannot read properties of undefined (reading 'children')`
- **Reason**: 
	- Probably outdated version of React provided as example code in Part 5.2 for "The components children, aka. props.children". 
	- Also could be due to ESLint and React Linting with `PropTypes`
- **Solution**: 
	- Remove `props` and specify props being passed, i.e., `children` and `buttonLabel`
	- Update `PropTypes` as follows:
	```javascript
	...
		ToggleContent.propTypes = {
   			buttonLabel: PropTypes.string,
 	   		children: PropTypes.node
		}
	```

<br>
<hr>


# 2 - Managing Component State in React Forms
- **Context**: 
	- It is easier to manage a Components own state rather than manage all of them in `App` component. This is called [Lifting State Up](https://react.dev/learn/sharing-state-between-components) as suggested in React Documentation.
	- Seperating Components to handle their own State. For instance, a form component handling the collection of user input. 
	- However, there can be issues when the form input data is not saved properly.
- **Reason**:
	- Direct mutation of the State variable leads to unexpected behavior.
	- **ALWAYS** handle the State variable through the `setState` function in the `onChange` attribute
- **Solution**:
	- Identify the issue through standard procedures - `console.log()` statements
	- Use `setState` function to assign the property at the `onChange` attribute
	- Use spread syntax to destructure object and add the relevant property at the `onChange` attribute
	
	```javascript
	...

	<form onSubmit={addBlog}>
		<div>
			Title: <input type="text" name="Title" value={newBlog.title || ''} onChange={(event) => setNewBlog({...newBlog, title: event.target.value})}/>
		</div>
		<div>
			Author: <input type="text" name="Author" value={newBlog.author || ''} onChange={(event) => setNewBlog({...newBlog, author: event.target.value})}/>
		</div>
		<div>
			URL: <input type="text" name="URL" value={newBlog.url || ''} onChange={(event) => setNewBlog({...newBlog, url: event.target.value})}/>
		</div>
	...	
	</form>
	
	...
	```

<br>
<hr>

# 3-1 - Handling User Information in Blog Updates
- **Context**: 
	- Updating Likes of a blog in blogs list sends `PUT` request to the backend via `axios`, which then updates the Database and returns the updated likes
	- However, response returned consists only of the user ID but not the username and name
	- Causing details of user such as name to be `null`
	- However, there is redundancy in displaying the information of the user who added the blog since only logged-in users can add/view their saved blogs.
- **Reason**: 
	- Redundancy aside
	- Server response for `HTTP PUT` request doesn't have the same parameters returned as the request parameters, hence only `user.id` is returned instead of `user.id`, `user.username` and `user.name`
- **Solution**: 
	- Server just updates the specific fields of the blog, i.e., `{ title, author, url, likes }`, hence `updatedBlog` returns only `user` reference Id
	- Group the `updatedBlog` object with reference to the user who updated it 
	- Query MongoDB to populate results with user as, 
	`.populate('user', {username: 1, name: 1, id: 1})`

# 3-2 - Like Button Counter Issues in Blog Posts
- **Context**: 
	- Likes button shows the count of likes, similar to a counter
	- Count starts rewinding to 1 after 6 and goes back and forth from then on, such as, after 6 : 1, 'like', 7, 'like', 2, 'like', 8...
	- Counter stops incrementing after 20
- **Reason**:
	- Based on general analysis, due to two reasons :
		- *Multiple State variable instances* through iterated component, Blog
		- *Lack of Local Storage* of number of likes

	- ACTUAL reason :
		- In the updated blog object, using the State variable, `blogLikes` instead of intermediate variable, `currentLikes` to capture the incremented likes
		- Display likes using State variable, `blogLikes` instead of object property, `blog.likes`

- **Solution**: 
	- ALWAYS update object properties using intermediate variables since, State variables are asynchronously updated leading to rendering delay
	- Set up Local storage for `blogLikes` to be re-rendered after every `HTTP PUT` request
<br>
<hr>

# 4-1 - Blog Deletion Issues for Authorized Users
- **Context**: 
	- `HTTP DELETE` request is supposed to delete blogs that are added by the User
	- User other than who added the blog cannot delete
	- But now, unable to delete even if the same user as the one who added
- **Reason**:
	- Server Response :
	```bash
		Invalid request because 664f3794d07ea6ed9a0d4a47 != fO7��~��
	```
	- Server Response due to extraction of raw document from MongoDB without any transformation, which is as below :
	```javascript
		blogToDelete Info :  {
			_id: new ObjectId('665f578cf4ac0d4cc49b87d3'),
			title: 'Test blog 1',
			author: 'Fooper',
			url: 'https://www.tester-fooper.com',
			likes: 35,
			user: new ObjectId('6650d855b02cf54992a0c29c'),
			__v: 0
		}
	```
- **Solution**:
	- Run `console.log` statements through every step of the backend
	- Based on the reason, we were trying to extract `._id` which is an `ObjectID` as `.id` and expecting it to be a `String` datatype
	- Simplified overview of the problem-solution
	```javascript
		// PREVIOUSLY
		...
		const userIdFromBlog = blogToDelete.user.id
		...

		// NOW
		...
		const userIdFromBlog = blogToDelete.user._id.toString()
		...
	```


# 4-2 - Ensuring Frontend Updates After Blog Deletion
- **Context**: DELETE request a success but frontend does not update the blogs list after removing a blog
- **Reason**: `Blog` component state variable, `blogs` needs to be updated via State setter function, `setBlogs`
- **Solution**:
	```javascript
	...
	// refresh blogs viewed
	const currentBlogs = blogs.filter(blog => blog.id !== blogToDelete.id ? blog : null)
	setBlogs(currentBlogs)
	...
	```

<br>
<hr>

# 5 - User Attribution in Blog Likes
- **Context**: 
	- Blog added by a user, 'X', should be shown as 'Added by X'
	- In this bug, even if blog is added by 'X', but liked by 'Y' then it shows up as 'Added by Y'
- **Reason**:
	- Local storage of likes is specific to blog id but not user id
- **Solution**:
	- Update local storage key for `getItem` and `setItem` functions
	```javascript
	// getter
	...
	const storedLikes = window.localStorage.getItem(`blogLikes-${blog.user.id}`)
	...

	// setter
	...	
	window.localStorage.setItem(`blogLikes-${blog.user.id}`, blog.likes)

	```

<br>
<hr>
<hr>