const Author = require('../models/author')
const Book = require('../models/book')
const { errorhandler, successhandler } = require('./responseHandler')

/**
 * Handle GET requests to the route ("/authors") for retrieving authors based on query parameters.
 * @param {Object} req - The request object containing query parameters.
 * @param {Object} res - The response object used to send a response.
 */
const allauthors = async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const authors = await Author.find(searchOptions)
        res.render('authors/index', {
            authors: authors,
            searchOptions: req.query
        })
    } catch (err) {
        next(errorhandler(err.message, 500))
    }
}

/**
 * Render the form page for adding a new author.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object used for rendering the new author form.
 */
const newauthor = (req, res) => {
    res.render('authors/new', { author: new Author() })
}

/**
 * Handle POST requests to create a new author.
 * @param {Object} req - The request object containing author details in the body.
 * @param {Object} res - The response object used for redirecting.
 */
const postauthor = async (req, res) => {
    const author = new Author({
        name: req.body.name
    })
    try {
        const newAuthor = await author.save()
        res.redirect(`authors/${newAuthor.id}`)
    } catch (err) {
        next(errorhandler(err.message, 500))
    }
}

/**
 * Handle GET requests to retrieve a specific author by ID and render their details along with associated books.
 * @param {Object} req - The request object containing the author ID.
 * @param {Object} res - The response object used for rendering the author details or redirecting.
 */
const authorbyid = async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        const books = await Book.find({ author: author.id }).limit(6).exec()
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        })
    } catch (err) {
        next(errorhandler(err.message, 500))
    }
}

/**
 * Handle GET requests to retrieve the form for editing an author.
 * @param {Object} req - The request object containing the author ID.
 * @param {Object} res - The response object used for rendering the author edit form or redirecting.
 */
const editauthor = async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', { author: author })
    } catch (err) {
        next(errorhandler(err.message, 500))
    }
}

/**
 * Handle PUT requests to update an author.
 * @param {Object} req - The request object containing the author ID and updated details.
 * @param {Object} res - The response object used for redirecting or rendering error messages.
 */
const updateauthor = async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)
    } catch (err) {
        next(errorhandler(err.message, 500))
    }
}

/**
* Handle DELETE requests to remove an author.
* @param {Object} req - The request object containing the author ID.
* @param {Object} res - The response object used for redirecting or rendering error messages.
*/
const deleteauthor = async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        await author.remove()
        res.redirect('/authors')
    } catch (err) {
        next(errorhandler(err.message, 500))
    }
}

module.exports = { allauthors, newauthor, postauthor, authorbyid, editauthor, updateauthor, deleteauthor }