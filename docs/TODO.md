# TODO

## MVP

- [x] **Add licensing** — Clarify learning purposes; don’t create a product that competes.
- [x] **Update landing page header** — Better reveal application goals (align with README.md).
- [ ] **Create app logo**
- [x] **Redesign pages** — More fancy and playful, but minimalistic.
- [ ] **Pick top-10 models for testing from OpenRouter**
- [ ] **Challanges overview page**
- [ ] **About page**
- [ ] **Reconsider challanges** — Review and refine test set (remove non-failing).
- [ ] **UX Review**
- - How failed answer looks like?

## Post-MVP

- [ ] **Agentic suggestion pre-validation**:
- - [ ] Run verification request for rules violation check
- - [ ] Extract validation criterias
- - [ ] Assign category\labels
- - [ ] Execute challange over free plans. If passes 50% (or top-20%) kill rate - added to the challange ladder

### Social

- [x] **Test suggestions form** — Test, success criteria, description.
- - [x] **Rules checkbox** - Prepare rules and limitations.
- [ ] **Authorization**
- [ ] **Voting** - Vote for memeness.
- [ ] **Report** - Report if the test has faulty conditions.
- [ ] **Cabinet** — Manage your tests / breakers.
- [ ] **Take a challange** - but as human

### Technical

- [ ] **Split validation job from task execution job**
- [x] **Add captcha with Cloudlare**
- [ ] **Setup queue for challanges run scheduling**
- [ ] **Enhance validation error handing** - Prevent submitted data loss, show progress
- [ ] **Error monitoring** - Setup Sentry
