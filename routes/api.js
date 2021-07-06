'use strict';

module.exports = (app) => {
  const mongoose = require('mongoose');

  mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true});

  const schema = new mongoose.Schema({
    issue_title: 'string',
    issue_text: 'string',
    created_by: 'string',
    assigned_to: 'string',
    status_text: 'string',
    open: 'boolean',
    project: 'string'
  }, {
    timestamps: {
      createdAt: 'created_on', 
      updatedAt: 'updated_on'
    }
  });
  
  const Issue = mongoose.model('Issue', schema);
  
  app.route('/api/issues/:project')
  
    .get((req, res) => {
      const query = Object.assign({},req.params,req.query);
      Issue.find(query, (err, data) => {
        res.json(data);
      });
    })
    
    .post((req, res) => {
      const project = req.params.project;
      const body = req.body;
      if(!body.issue_title || !body.issue_text || !body.created_by)
        res.json({error: 'required field(s) missing'});
      else {
        const issue = new Issue({
          issue_title: body.issue_title,
          issue_text: body.issue_text,
          created_by: body.created_by,
          assigned_to: body.assigned_to || "",
          status_text: body.status_text || "",
          open: true,
          project: project
        });
        issue.save((err,data) => {
          res.json(data)
        })
      }
    })
    
    .put(function (req, res){
      const project = req.params.project;
      const body = req.body;
      const _id = req.body._id;
      if (!_id)
        res.json({ error: 'missing _id' });
      else if(!body.issue_title && !body.issue_text && !body.created_by && !body.assigned_to && !body.status_text)
        res.json({ error: 'no update field(s) sent', '_id': body._id });
      else
        Issue.findOneAndUpdate({project: project, _id: _id} , body,{useFindAndModify: false}, (err, data) =>
          ! data ? res.json({ error: 'could not update', '_id': _id })
          :       res.json({  result: 'successfully updated', '_id': _id })
        );
    })
    
    .delete((req, res) => {
      const _id = req.body._id;
      if(!_id){
        res.json({ error: 'missing _id' });
      }
      else
        Issue.findByIdAndDelete(_id, (err, data) => {
          ! data ?  res.json({ error: 'could not delete', '_id': _id })
          :         res.json({ result: 'successfully deleted', '_id': _id })
        })
    });
    
};
