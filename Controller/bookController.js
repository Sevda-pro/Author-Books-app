const Book = require('../models/book')
const Author = require('../models/author')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const { errorhandler, successhandler } = require('./responseHandler')

/**
 * Handle GET requests to the root route ("/") for retrieving books based on query parameters.
 * @param {Object} req - The request object containing query parameters.
 * @param {Object} res - The response object used for redirect and render.
 */
const getbooks = async (req, res) => {
    let query = Book.find()
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter)
    }
    try {
        const books = await query.exec()
        res.render('books/index', {
            books: books,
            searchOptions: req.query
        })
    } catch (err) {
        next(errorhandler(err.message, 500))
    }
}

/**
* Handle GET requests to retrieve the form for adding a new book.
* @param {Object} req - The request object.
* @param {Object} res - The response object used for rendering the new book form.
*/
const newbook = async (req, res) => {
    renderNewPage(res, new Book())
}

/**
* Handle POST requests to create a new book.
* @param {Object} req - The request object containing book details in the body.
* @param {Object} res - The response object used for redirecting.
*/

const postbook = async (req, res) => {
    try {
        if (req.body.title.length > 3) {
            const book = new Book({
                title: req.body.title,
                author: req.body.author,
                publishDate: new Date(req.body.publishDate),
                pageCount: req.body.pageCount,
                description: req.body.description
            });
            saveCover(book, req.body.cover);

            const newBook = await book.save();
            res.redirect(`books/${newBook.id}`);
        }
        else{
            next(errorhandler("Title should be longer than 3 characters.",400))
        }
    } catch {
        renderNewPage(res, book, true)
    }
}

/**
* Handle GET requests to retrieve a specific book by ID and render its details.
* @param {Object} req - The request object containing the book ID.
* @param {Object} res - The response object used for rendering the book details or redirecting.
*/

const getbookbyid = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('author').exec()
        res.render('books/show', { book: book })
    } catch (err) {
        next(errorhandler(err.message, 500))
    }
}

/**
* Handle GET requests to retrieve the form for editing an existing book.
* @param {Object} req - The request object containing the book ID.
* @param {Object} res - The response object used for rendering the book edit form or redirecting.
*/

const editbook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        renderEditPage(res, book)
    } catch (err) {
        next(errorhandler(err.message, 500))
    }
}

/**
* Handle PUT requests to update an existing book.
* @param {Object} req - The request object containing the book ID and updated details.
* @param {Object} res - The response object used for redirecting.
*/

const updatebook = async (req, res) => {
    let book;
    try {
        if (req.body.title.length > 3)
         {
            book.title = req.body.title;
            book.author = req.body.author;
            book.publishDate = new Date(req.body.publishDate);
            book.pageCount = req.body.pageCount;
            book.description = req.body.description;
            if (req.body.cover != null && req.body.cover !== '') {
                saveCover(book, req.body.cover);
            }
            await book.save();
            res.redirect(`/books/${book.id}`);
        }
        else{
           next(errorhandler("Title should be longer than 3 characters.",400))
        }
    } catch (err) {
        next(errorhandler(err.message, 500))
    }
}

/**
* Handle DELETE requests to remove an existing book.
* @param {Object} req - The request object containing the book ID.
* @param {Object} res - The response object used for redirecting or rendering error messages.
*/

const deletebook = async (req, res) => {
    let book
    try {
        book = await Book.findById(req.params.id)
        await book.remove()
        res.redirect('/books')
    } catch (err) {
        next(errorhandler(err.message, 500))
    }
}
/**
* Render the form page for creating a new book.
* @param {Object} res - The response object used for rendering the page.
* @param {Object} book - The book object to be used in the form.
* @param {boolean} hasError - Indicates whether there is an error in the form submission.
*/

async function renderNewPage(res, book, hasError = false) {
    renderFormPage(res, book, 'new', hasError)
}
/**
 * Render the form page for Editing the book.
 * @param {Object} res - The response object used for rendering the page.
 * @param {Object} book - The book object to be used in the form.
 * @param {boolean} hasError - Indicates whether there is an error in the form submission.
 */
async function renderEditPage(res, book, hasError = false) {
    renderFormPage(res, book, 'edit', hasError)
}
/**
 * Render the form page for either creating or editing a book.
 * @param {Object} res - The response object used for rendering the page.
 * @param {Object} book - The book object to be used in the form.
 * @param {string} form - The type of form.
 * @param {boolean} hasError - Indicates whether there is an error in the form submission.
 */

async function renderFormPage(res, book, form, hasError = false) {
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Book'
            } else {
                params.errorMessage = 'Error Creating Book'
            }
        }
        res.render(`books/${form}`, params)
    } catch (err) {
        next(errorhandler(err.message, 500))
    }
}
/**
 * Save the cover image of a book.
 * @param {Object} book - The book object to which the cover image will be associated.
 * @param {string} coverEncoded - The base64 encoded cover image data.
 */

function saveCover(book, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type
    }
}

module.exports = { getbooks, newbook, postbook, getbookbyid, deletebook, updatebook, editbook }