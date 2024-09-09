# End-to-End(E2E) Testing
- `Playwright` : 
	- for automated frontend-backend testing using different browsers
	- simulates user actions through application tests 

<br>
<hr>
<hr>

## 1 - Authentication mismatch and Identity overlap with JWT
- **Context**: 
	- JWT authentication is handled in the Backend middleware for `POST`/`PUT`/`DELETE` requests
	- Frontend saves the JWT on browser's `localStorage` and tags it with the `POST`/`PUT`/`DELETE` requests from the frontend API to the Backend router
	- However, in E2E testing the JWT needs to be manually defined in the tests to be forwarded via the `POST`/`PUT`/`DELETE` requests
	```javascript
	...
	describe('Login', () => {
		...//login registered user
		test('Logged user can add blog', async({ page }) => {
			const appUser = await page.evaluate(() => localStorage.getItem('loggedBlogappUser'))
			console.log('USER: ', JSON.parse(appUser))	// logs: null, test fails
			const token = JSON.parse(appUser).token
			await page.setExtraHTTPHeaders({
			Authorization: `Bearer ${token}`
			})
			console.log('TOKEN: ', token);
		})
	})
	```
- **Reason**: JWT mismatch with User identity. Elaborate reasoning as follows:
	- *JWT Storage Mistake*: where both users are accessing the application from the same browser. In that case, `localStorage` holds the JWT which is NOT properly isolated and overwrites one user's JWT with another.
	- *Improper JWT Validation*: when backend middleware is just checking if the JWT is valid, but NOT ensuring if the JWT corresponds to the user making the request.
- **Solution**: Possible solutions :
	- *`httpOnly` Cookie*: which wraps JWT in a cookie and serves to backend controller alongwith HTTP requests.
		- Pros: 
			- No additional frontend API request interceptors required for passing token
			- No JavaScript needed, handled directly via HTTP requests
			- Cross-Site Scripting (XSS) attacks cannot access JWT via `localStorage`
		- Cons:
			- Vulnerable to Cross-Site Request Forgery (CSRF) attacks 
	- *Server-Side Session Management*: where each user's JWT is associated with a unique session ID
		- Pros:
			- Enhanced user validation
		- Cons:
			- Increased latency, unless external cache-database is used.

	> Combined solutions could make the application secure but at this stage, using `httpOnly` Cookie is sufficient.

	### Workflow
	Changes to be made for implementing `httpOnly` Cookie implementation starts from "Authenticate user"
	```mermaid
		flowchart TD
			Client[App.jsx]-->|handleLogin| Service[(services/login.js)]
			Service-->|POST /api/login|Auth[Authenticate user]
			Auth-->|httpOnly cookie, add to request Headers| B(controllers/login.js)
			B -->|userExtractor| C(utils/middleware/)
			C -->|route requests| D[controllers/blogs.js]
			D -->|response| Service
			Service -->|manage Component State| Client
	```

<br>
<hr>

## 2 - 'Added by' not updated until liked after 'Add Blog' POST request
- **Context**:
	- After `addBlog` `POST` request, the backend API returns a reference ID to simulate a `JOIN` between `blogs` and `users` collections
	- This reference ID is used to `populate` the `Blog` component in the frontend via the `POST` request response
	- However, as soon as the blog is added via the `POST` request the '_Added by_' section of the component remains `undefined`
- **Reason**:
	- ~~Probable re-rendering the component error after POST request~~ -- WRONG
	- `POST` request response object does NOT `populate` the `user` collection fields!
	- Need to generate a response object including populated details from `user` collection
- **Solution**:
	- Call the `useEffect` hook used to fetch all blogs, after receiving response from `POST` request
	```javascript
		// POST - addBlogToList handler
		const processBlogInfo = async(blogObject) => {
    	  	const response = await blogService.addBlog(blogObject)
      		fetchBlogsHook()  // to populate user info
      		setBlogs(blogs.concat(response))
			...		
		}
	```

<br>
<hr>

## 3-1 - Handling Race Conditions with multiple asynchronous operations
- **Context**: 
	- In the final test to sort the blogs in descending order of likes, we need to add multiple blogs and replicate likes randomly for each of them
	> *Race condition* is the situation when multiple programs (threads, processes, operations, etc.) are accessing a shared resource(variables, files, etc.) simultaneously. 
	
	> Sometimes these programs are ordered to be executed in a specific sequence, but due to concurrency in *[Async architecture](https://www.geeksforgeeks.org/how-to-fix-a-race-condition-in-an-async-architecture/)* sequential execution is not implemented. Hence, leading to unpredictable outcomes.

	> **Note**: Technically, JavaScript cannot have '*Race Conditions*' due to the fact that it is a single-threaded language. This could be a possible '*Race Condition*' but not based on threaded-processes.

	- In our case, it is execution of multiple `async` operations in a specific order as follows:
		```
			// step 1 - add blog
			// step 2 - like blog mentioned number of times
			// step 3 - add another blog
			// .
			// .
			// step n - log out
		```
- **Reason**:
	- Improper orchestration of above listed asynchronous operations without handler functions for concurrent execution
	- ~~Concurrent execution can be handled via `Promise.all` and `waitFor` methods~~ -- NOT Working
	- Mutual Exclusion and Error Handling is the next alternative to handle the concurrent execution
- **Solution**:
	- Trials :
		1. Set `helper.js` to handle multiple clicks without `clickCount` parameter (which was non-existent in `Playwright`) using `for` loop
		2. Debug and manually execute test for `helper.likeBlog` `async` operations -- SUCCESS! Passed with all 3 browsers (`firefox, chromium, webkit`)
		3. ~~To pass automated test - Setup temporary variables to handle multiple `async` and complete sequential execution~~ -- WRONG ([StackOverflow](https://stackoverflow.com/questions/7238586/do-i-need-to-be-concerned-with-race-conditions-with-asynchronous-javascript))
	- Manual 'click' of Like button via debug mode (`npm test -- -g 'Has existing blogs' --debug`) executes the test successfully, as shown in end results below:
		```
			Slow test file: [firefox] › existing_blogs.spec.js (56.8s)
			Slow test file: [webkit] › existing_blogs.spec.js (51.6s)
			Slow test file: [chromium] › existing_blogs.spec.js (49.8s)
			Consider splitting slow test files to speed up parallel execution
			3 passed (2.7m)
		```
		> ![debugged test result](ex5.23-result.png)


# 3-2 - `async/await` operations complete tasks but UI does not update
- **Context**:
	- `async/await` operations are fulfilling their tasks of clicking 'Like' button multiple times as evidenced from the `console.log` statements below :
	```
		$ npm test -- -g 'Has existing blogs' --debug

		> e2e-tests@1.0.0 test
		> playwright test -g Has existing blogs --debug


		Running 3 tests using 1 worker
		[chromium] › existing_blogs.spec.js:49:9 › Blog App setup › Has existing blogs › sorted by descending likes
		Liked Test blog 1 by Sallita 1 times
		Liked Test blog 1 by Sallita 2 times
		Liked Test blog 1 by Sallita 3 times
		Liked Test blog 1 by Sallita 4 times
		Liked Test blog 1 by Sallita 5 times
		Liked Test blog 12 by Sampuri 1 times
		Liked Test blog 12 by Sampuri 2 times
		Liked Test blog 12 by Sampuri 3 times
		Liked Test blog 12 by Sampuri 4 times
		Liked Test blog 12 by Sampuri 5 times
		Liked Test blog 12 by Sampuri 6 times
		Liked Test blog 12 by Sampuri 7 times
		Liked Test blog 12 by Sampuri 8 times
		Liked Test blog 123 by Sampuri 1 times
		Liked Test blog 123 by Sampuri 2 times
		Liked Test blog 123 by Sampuri 3 times
		Liked Test blog 1234 by Sallita 1 times
		Liked Test blog 1234 by Sallita 2 times
		Liked Test blog 1234 by Sallita 3 times
		Liked Test blog 1234 by Sallita 4 times
		Liked Test blog 1234 by Sallita 5 times
		Liked Test blog 1234 by Sallita 6 times
		Liked Test blog 1234 by Sallita 7 times
		Liked Test blog 1234 by Sallita 8 times
		Liked Test blog 1234 by Sallita 9 times
		Blog likes completed                                                                                                  
		Blog likes completed                                                                                                  
		Blog likes completed                                                                                                  
		Blog likes completed     
	```

	- But the UI renders only partial 'likes' for each blog. Hence, test assertion fails, as shown below:
	```
		1) [chromium] › existing_blogs.spec.js:49:9 › Blog App setup › Has existing blogs › sorted by descending likes      

		Error: Timed out 5000ms waiting for expect(locator).toHaveText(expected)

		Locator: getByTestId('likes').first()
		Expected pattern: /9 likes/
		Received string:  "3 likesLike"
	```

- **Reason**: 
	- Result from [issue 3-1](#3-1---handling-race-conditions-with-multiple-asynchronous-operations) suggests the debugged tests are slow test files
	- Probable alternative is to slow down the test using either of the following :
		- `test.slow()` : to adjust test timeout settings, i.e., increases 3X
		- `slowMo` : to observe browser interactions in real time, i.e., UI updates are noticed
- **Solution**: 
	- [Medium blog reference](https://medium.com/@semihkasimoglu/understanding-playwrights-test-slow-and-slowmo-option-a-guide-for-efficient-test-management-8caf3a5183ba) for `test.slow()` and `slowMo` usage
	- `slowMo` was the ideal solution to notice the UI changes in 'likes' section of the blog `div`
	- `slowMo` settings appear to be ideal for any test success which involves multiple/repetitive actions performed that reflect UI changes
	- `slowMo` configured in `playwright.config.js` under the `use` property of `module.exports` as follows:
	```javascript
	// playwright.config.js
		module.exports = {
			// other properties
			...
			use: {
				...
				launchOptions: {
					slowMo: 100,
				},
				...
			}
		}
	```

<hr>
<hr>
<br>
