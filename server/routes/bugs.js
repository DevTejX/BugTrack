const express = require('express')
const mongoose = require('mongoose')
const Bug = require('../models/Bug')

const router = express.Router()

// GET: Fetch all bug reports
router.get('/', async (req, res) => {
  try {
    const bugs = await Bug.find().sort({ createdAt: -1 })
    res.status(200).json(bugs)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bug reports.' })
  }
})

// GET: Fetch one bug report
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid bug ID.' })
    }

    const bug = await Bug.findById(req.params.id)

    if (!bug) {
      return res.status(404).json({ message: 'Bug report not found.' })
    }

    res.status(200).json(bug)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bug report.' })
  }
})

// POST: Create a bug report
router.post('/', async (req, res) => {
  try {
    const { title, description, severity } = req.body

    if (
      typeof title !== 'string' ||
      !title.trim() ||
      typeof description !== 'string' ||
      !description.trim()
    ) {
      return res.status(400).json({
        message: 'Title and description are required.',
      })
    }

    if (title.trim().length > 120 || description.trim().length > 500) {
      return res.status(400).json({
        message: 'Title or description exceeds the allowed length.',
      })
    }

    if (
      severity !== undefined &&
      !['Low', 'Medium', 'High'].includes(severity)
    ) {
      return res.status(400).json({ message: 'Invalid severity.' })
    }

    const bug = await Bug.create({
      title: title.trim(),
      description: description.trim(),
      severity,
    })

    res.status(201).json(bug)
  } catch (error) {
    res.status(400).json({ message: 'Failed to create bug report.' })
  }
})

// PUT: Update a bug report
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid bug ID.' })
    }

    const allowedFields = ['title', 'description', 'severity', 'status']
    const updates = {}

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field]
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: 'Provide at least one field to update.',
      })
    }

    if (
      updates.title !== undefined &&
      (typeof updates.title !== 'string' ||
        !updates.title.trim() ||
        updates.title.trim().length > 120)
    ) {
      return res.status(400).json({ message: 'Invalid bug title.' })
    }

    if (
      updates.description !== undefined &&
      (typeof updates.description !== 'string' ||
        !updates.description.trim() ||
        updates.description.trim().length > 500)
    ) {
      return res.status(400).json({ message: 'Invalid bug description.' })
    }

    if (
      updates.severity !== undefined &&
      !['Low', 'Medium', 'High'].includes(updates.severity)
    ) {
      return res.status(400).json({ message: 'Invalid severity.' })
    }

    if (
      updates.status !== undefined &&
      !['Open', 'Closed'].includes(updates.status)
    ) {
      return res.status(400).json({ message: 'Invalid status.' })
    }

    if (updates.title !== undefined) {
      updates.title = updates.title.trim()
    }

    if (updates.description !== undefined) {
      updates.description = updates.description.trim()
    }

    const bug = await Bug.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })

    if (!bug) {
      return res.status(404).json({ message: 'Bug report not found.' })
    }

    res.status(200).json(bug)
  } catch (error) {
    res.status(400).json({ message: 'Failed to update bug report.' })
  }
})

// DELETE: Remove a bug report
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid bug ID.' })
    }

    const bug = await Bug.findByIdAndDelete(req.params.id)

    if (!bug) {
      return res.status(404).json({ message: 'Bug report not found.' })
    }

    res.status(200).json({
      message: 'Bug report deleted successfully.',
    })
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete bug report.' })
  }
})

module.exports = router