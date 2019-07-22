---
title: hexo使用Travis自动发布到github-pages
date: 2019-7-22 15:6:18
tags:效率
---

# [hexo](https://hexo.io/zh-cn/)

1. 安装hexo
   1. `npm install hexo-cli -g`
   2. `hexo init blog`
   3. `cd blog`

2. 配置github

   1. 创建项目blog（必须为public）`blog.github.io`

   2. 创建token[Generate new token](https://github.com/settings/tokens)

      > 勾选 repo 及user下的user:email

   3. 复制生成的token，并将其保存


2. 配置Travis

   1. 使用github账号登录Travis
   2. 在[settings](https://travis-ci.org/account/repositories)中找到blog,打开其右侧的小开关，然后点击最右侧的settings进入设置界面
   3. 找到Environment Variables并创建环境变量 `DEPLOY_REPO` value为第二步中生成的token加上github中的git地址 像这样的形式`https://16b15f1ae07a172ffb50583de0c37e49ae729120@github.com/alphasen/blog.github.io.git`

4. 配置blog项目


   1. 在第一步中生成的blog文件夹中创建git项目

   2. 保存当前内容到master分支(`git add .` `git commit -m 'init'`)

   3. 创建新分支`git checkout -b hexo`

   4. 在根目录下新建`.travis.yml`

   5. 编辑travis配置文件

      ```yaml
      language: node_js
      # sudo: false
      node_js:
      - '9'
      branches:
        only:
        - hexo

      install:
      - npm install

      script:
      - ./node_modules/.bin/hexo generate

      after_success:
      - mkdir .deploy
      - cd .deploy
      - git clone --depth 1 --branch master --single-branch $DEPLOY_REPO . || (git init && git remote add -t master origin $DEPLOY_REPO)
      - rm -rf ./*                      # Clear old verion
      - cp -r ../public/* .             # Copy over files for new version
      - git add -A .
      - git commit -m 'Site updated'    # Make a new commit for new version
      - git branch -m master
      - git push -q -u origin master  # Push silently so we don't leak information

      ```

   6. `git add .`

   7. `git commit -m 'init'`

   8. 配置远程仓库`git config remote origin git@github.com:alphasen/alphasen.github.io.git`

   9. 将hexo分支推到github`git push -u origin hexo`

   10. 将master分支推送到github`git push -u origin master`

4. 访问https://travis-ci.org/xxx/blog.github.io查看构建进度

5. 构建完成后https://blogxxx.github.io就可以正常访问了

6. 如有问题，请参考`https://github.com/alphasen/alphasen.github.io`
