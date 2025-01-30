#!/bin/bash
set -e

echo "Start entrypoint.prod.sh"

echo "rm -f /myapp/tmp/pids/server.pid"
rm -f /myapp/tmp/pids/server.pid

echo $RAILS_MASTER_KEY

# echo "bundle exec rails db:create RAILS_ENV=production"
# bundle exec rails db:create RAILS_ENV=production

echo "bundle exec rails db:migrate RAILS_ENV=production"
bundle exec rails db:migrate RAILS_ENV=production

# echo "bundle exec rails runner db/seeds/admin_users.rb RAILS_ENV=production"
# bundle exec rails runner db/seeds/admin_users.rb RAILS_ENV=production

echo "bundle exec pumactl start"
bundle exec pumactl start